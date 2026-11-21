// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { enforceFeedbackRate } from '@/lib/feedback/rate-limit';
import { POST } from './route';

vi.mock('@/lib/feedback/rate-limit', () => ({
   enforceFeedbackRate: vi.fn(),
}));

const enforce = vi.mocked(enforceFeedbackRate);

const envKeys = [
   'RESEND_API_KEY',
   'FEEDBACK_TO_EMAIL',
   'FEEDBACK_FROM_EMAIL',
] as const;

function validBody(overrides: Record<string, unknown> = {}) {
   return {
      message: 'The caret jumps after a restart on words mode.',
      email: 'person@example.com',
      elapsedMs: 5_000,
      context: {
         page: '/',
         theme: 'light-orange',
         mode: 'time 30',
         userAgent: 'TestAgent',
      },
      ...overrides,
   };
}

function post(body: unknown, headers?: HeadersInit): Request {
   return new Request('http://localhost/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...headers },
      body: JSON.stringify(body),
   });
}

describe('POST /api/feedback', () => {
   beforeEach(() => {
      enforce.mockReset();
      enforce.mockResolvedValue('ok');
      for (const key of envKeys) {
         delete process.env[key];
      }
      process.env.RESEND_API_KEY = 'test-resend-key';
      process.env.FEEDBACK_TO_EMAIL = 'kdomeh@mail.grokbot.com';
      process.env.FEEDBACK_FROM_EMAIL = 'feedback@tipohiz.test';
      vi.stubGlobal(
         'fetch',
         vi
            .fn()
            .mockResolvedValue(
               new Response(JSON.stringify({ id: 'email_1' }), { status: 200 })
            )
      );
   });

   it('should pretend success and send nothing when the honeypot is filled', async () => {
      const response = await POST(
         post(validBody({ website: 'https://spam.example' }))
      );

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: true });
      expect(fetch).not.toHaveBeenCalled();
      expect(enforce).not.toHaveBeenCalled();
   });

   it('should pretend success and send nothing when elapsedMs is under 3 seconds', async () => {
      const response = await POST(post(validBody({ elapsedMs: 2_999 })));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: true });
      expect(fetch).not.toHaveBeenCalled();
   });

   it('should send when elapsedMs is at least 3 seconds', async () => {
      const response = await POST(post(validBody({ elapsedMs: 3_000 })));

      expect(response.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(1);
   });

   it('should send when elapsedMs is 3500 even if the server clock is skewed', async () => {
      vi.spyOn(Date, 'now').mockReturnValue(0);

      const past = await POST(post(validBody({ elapsedMs: 3_500 })));

      expect(past.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(1);

      vi.spyOn(Date, 'now').mockReturnValue(8.64e15);
      const future = await POST(post(validBody({ elapsedMs: 3_500 })));

      expect(future.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(2);
   });

   it.each([
      ['too short', 'tiny'],
      ['too long', 'a'.repeat(2001)],
   ])('should reject a %s message with 400', async (_label, message) => {
      const response = await POST(post(validBody({ message })));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Invalid feedback' });
      expect(fetch).not.toHaveBeenCalled();
   });

   it('should reject an invalid email with 400', async () => {
      const response = await POST(post(validBody({ email: 'not-an-email' })));

      expect(response.status).toBe(400);
      expect(await response.json()).toEqual({ error: 'Invalid feedback' });
      expect(fetch).not.toHaveBeenCalled();
   });

   it('should return 503 when a feedback env var is missing', async () => {
      delete process.env.RESEND_API_KEY;

      const response = await POST(post(validBody()));

      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({
         error: 'Feedback is unavailable right now.',
      });
      expect(fetch).not.toHaveBeenCalled();
   });

   it('should still send when the rate limit store throws', async () => {
      enforce.mockRejectedValue(
         Object.assign(new Error('DatabaseDifferCase'), {
            name: 'MongoServerError',
            code: 13297,
         })
      );
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      const response = await POST(post(validBody()));

      expect(response.status).toBe(200);
      expect(await response.json()).toEqual({ ok: true });
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(
         'Feedback rate limit check failed',
         { name: 'MongoServerError', code: 13297 }
      );
      const logged = JSON.stringify(errorSpy.mock.calls);
      expect(logged).not.toContain('test-resend-key');
      expect(logged).not.toContain('The caret jumps');
   });

   it('should return 429 when the rate limit is exceeded', async () => {
      enforce.mockResolvedValue('limited');

      const response = await POST(post(validBody()));

      expect(response.status).toBe(429);
      expect(fetch).not.toHaveBeenCalled();
   });

   it('should send with reply_to and the recipient from env', async () => {
      const response = await POST(post(validBody()));

      expect(response.status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(1);
      const [url, init] = vi.mocked(fetch).mock.calls[0] ?? [];
      expect(url).toBe('https://api.resend.com/emails');
      const payload = JSON.parse(String(init?.body)) as {
         to: string;
         from: string;
         reply_to?: string;
         subject: string;
      };
      expect(payload.to).toBe(process.env.FEEDBACK_TO_EMAIL);
      expect(payload.from).toBe(process.env.FEEDBACK_FROM_EMAIL);
      expect(payload.reply_to).toBe('person@example.com');
      expect(payload.subject.startsWith('TipoHiZ feedback: ')).toBe(true);
      expect(payload.subject).not.toMatch(/[\r\n]/);
      const headers = new Headers(init?.headers);
      expect(headers.get('Authorization')).toBe('Bearer test-resend-key');
   });
});
