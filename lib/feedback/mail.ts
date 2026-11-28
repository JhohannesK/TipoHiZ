import { escapeHtml } from './schema';

export type FeedbackMailContext = {
   page: string;
   theme: string;
   mode: string;
   userAgent: string;
};

export type FeedbackMailEnv = {
   apiKey: string;
   to: string;
   from: string;
};

export function honeypotFilled(body: unknown): boolean {
   if (typeof body !== 'object' || body === null || !('website' in body)) {
      return false;
   }

   const website = body.website;
   return typeof website === 'string' && website.trim().length > 0;
}

export function feedbackMailEnv(): FeedbackMailEnv | undefined {
   const apiKey = process.env.RESEND_API_KEY;
   const to = process.env.FEEDBACK_TO_EMAIL;
   const from = process.env.FEEDBACK_FROM_EMAIL;
   if (!apiKey || !to || !from) return undefined;
   return { apiKey, to, from };
}

export function feedbackMailContent(input: {
   message: string;
   email?: string;
   context: FeedbackMailContext;
}): { text: string; html: string; replyTo: string | undefined } {
   const replyEmail = input.email?.trim() ?? '';
   const displayEmail = replyEmail || '(none)';
   const { message, context } = input;
   const text = [
      message,
      '',
      `Email: ${displayEmail}`,
      `Page: ${context.page}`,
      `Theme: ${context.theme}`,
      `Mode: ${context.mode}`,
      `Browser: ${context.userAgent}`,
   ].join('\n');
   const html = `<p>${escapeHtml(message).replace(
      /\n/g,
      '<br>'
   )}</p><p>Email: ${escapeHtml(displayEmail)}</p><ul><li>Page: ${escapeHtml(
      context.page
   )}</li><li>Theme: ${escapeHtml(context.theme)}</li><li>Mode: ${escapeHtml(
      context.mode
   )}</li><li>Browser: ${escapeHtml(context.userAgent)}</li></ul>`;

   return {
      text,
      html,
      replyTo: replyEmail || undefined,
   };
}
