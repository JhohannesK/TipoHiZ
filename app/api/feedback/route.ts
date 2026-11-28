import {
   feedbackMailContent,
   feedbackMailEnv,
   honeypotFilled,
} from '@/lib/feedback/mail';
import { mongoErrorLabel } from '@/lib/feedback/mongo-error';
import { enforceFeedbackRate } from '@/lib/feedback/rate-limit';
import {
   MIN_FILL_MS,
   feedbackBodySchema,
   feedbackSubject,
} from '@/lib/feedback/schema';

function json(body: unknown, status: number): Response {
   return Response.json(body, { status });
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

   const { message, email, elapsedMs, context } = parsed.data;
   if (elapsedMs < MIN_FILL_MS) {
      return json({ ok: true }, 200);
   }

   const env = feedbackMailEnv();
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
      console.error('Feedback rate limit check failed', mongoErrorLabel(error));
   }

   const mail = feedbackMailContent({ message, email, context });
   const payload: Record<string, unknown> = {
      from: env.from,
      to: env.to,
      subject: feedbackSubject(message),
      text: mail.text,
      html: mail.html,
   };

   if (mail.replyTo) payload.reply_to = mail.replyTo;

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
