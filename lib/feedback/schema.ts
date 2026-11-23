import { z } from 'zod';

export const CONTEXT_MAX = 300;
const MESSAGE_MIN = 10;
const MESSAGE_MAX = 2000;
const EMAIL_MAX = 254;

export const feedbackContextSchema = z.object({
   page: z.string().max(CONTEXT_MAX),
   theme: z.string().max(CONTEXT_MAX),
   mode: z.string().max(CONTEXT_MAX),
   userAgent: z.string().max(CONTEXT_MAX),
});

export const feedbackBodySchema = z.object({
   message: z.string().trim().min(MESSAGE_MIN).max(MESSAGE_MAX),
   email: z
      .string()
      .trim()
      .max(EMAIL_MAX)
      .refine((value) => value === '' || z.email().safeParse(value).success, {
         error: 'Invalid email',
      })
      .optional(),
   elapsedMs: z.number().finite().min(0),
   context: feedbackContextSchema,
});

export type FeedbackBody = z.infer<typeof feedbackBodySchema>;

export function optionalEmailOk(value: string): boolean {
   const trimmed = value.trim();
   if (trimmed.length === 0) return true;
   if (trimmed.length > EMAIL_MAX) return false;
   return z.email().safeParse(trimmed).success;
}

export function feedbackSubject(message: string): string {
   const singleLine = message.replace(/[\r\n]+/g, ' ').slice(0, 60);
   return `TipoHiZ feedback: ${singleLine}`;
}

export function escapeHtml(value: string): string {
   return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}

export const MIN_FILL_MS = 3000;
export const MESSAGE_MIN_LENGTH = MESSAGE_MIN;
export const MESSAGE_MAX_LENGTH = MESSAGE_MAX;
