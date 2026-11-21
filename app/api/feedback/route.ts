import { mongoErrorLabel } from '@/lib/feedback/mongo-error';
import { enforceFeedbackRate } from '@/lib/feedback/rate-limit';
import {
   MIN_FILL_MS,
   escapeHtml,
   feedbackBodySchema,
   feedbackSubject,
} from '@/lib/feedback/schema';

function json(body: unknown, status: number): Response {
   return Response.json(body, { status });
}

function honeypotFilled(body: unknown): boolean {
   if (typeof body !== 'object' || body === null || !('website' in body)) {
      return false;
   }

   const website = body.website;
   return typeof website === 'string' && website.trim().length > 0;
}

function feedbackEnv():
   | { apiKey: string; to: string; from: string }
   | undefined {
   const apiKey = process.env.RESEND_API_KEY;
   const to = process.env.FEEDBACK_TO_EMAIL;
   const from = process.env.FEEDBACK_FROM_EMAIL;
   if (!apiKey || !to || !from) return undefined;
   return { apiKey, to, from };
}

function plainBody(
   message: string,
   email: string,
   context: { page: string; theme: string; mode: string; userAgent: string }
): string {
   return [
      message,
      '',
      `Email: ${email || '(none)'}`,
      `Page: ${context.page}`,
      `Theme: ${context.theme}`,
      `Mode: ${context.mode}`,
      `Browser: ${context.userAgent}`,
   ].join('\n');
}

export async function POST(request: Request): Promise<Response> {
   let body: unknown;
   try {
      body = await request.json();
   } catch {
      return json({ error: 'Invalid feedback' }, 400);
   }

   if (honeypotFilled(body)) {
      return json({ ok: true }, 200);
   }

   const parsed = feedbackBodySchema.safeParse(body);
   if (!parsed.success) {
      return json({ error: 'Invalid feedback' }, 400);
   }

   const { message, email, openedAt, context } = parsed.data;
   if (Date.now() - openedAt < MIN_FILL_MS) {
      return json({ ok: true }, 200);
   }

   const env = feedbackEnv();
   if (!env) {
      return json({ error: 'Feedback is unavailable right now.' }, 503);
   }

   try {
      const decision = await enforceFeedbackRate(request);
      if (decision === 'limited') {
         return json(
            { error: "You've sent a few already. Try again in a minute." },
            429
         );
      }
   } catch (error: unknown) {
      console.error(
         'Feedback rate limit check failed',
         mongoErrorLabel(error)
      );
   }

   const replyEmail = email?.trim() ?? '';
   const text = plainBody(message, replyEmail, context);
   const html = `<p>${escapeHtml(message).replace(
      /\n/g,
      '<br>'
   )}</p><p>Email: ${escapeHtml(
      replyEmail || '(none)'
   )}</p><ul><li>Page: ${escapeHtml(context.page)}</li><li>Theme: ${escapeHtml(
      context.theme
   )}</li><li>Mode: ${escapeHtml(context.mode)}</li><li>Browser: ${escapeHtml(
      context.userAgent
   )}</li></ul>`;
   const payload: Record<string, unknown> = {
      from: env.from,
      to: env.to,
      subject: feedbackSubject(message),
      text,
      html,
   };

   if (replyEmail) payload.reply_to = replyEmail;

   try {
      const response = await fetch('https://api.resend.com/emails', {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${env.apiKey}`,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(payload),
      });

      if (!response.ok) {
         console.error('Feedback email was rejected', response.status);
         return json({ error: "Couldn't send. Try again." }, 502);
      }
   } catch {
      console.error('Feedback email request failed');
      return json({ error: "Couldn't send. Try again." }, 502);
   }

   return json({ ok: true }, 200);
}
