import { CONTEXT_MAX, MESSAGE_MIN_LENGTH, MIN_FILL_MS } from './schema';

export type FeedbackSendStatus = 'idle' | 'sending' | 'success' | 'error';

export function clipContext(value: string): string {
   return value.slice(0, CONTEXT_MAX);
}

export function feedbackModeLabel(input: {
   category: string;
   time: number;
   wordCount: number;
}): string {
   if (input.category === 'words') return `words ${input.wordCount}`;
   return `time ${input.time}`;
}

export function remainingFillWait(
   openedAt: number,
   now: number,
   minFillMs: number = MIN_FILL_MS
): number {
   return Math.max(0, minFillMs - (now - openedAt));
}

export function elapsedSinceOpen(openedAt: number, now: number): number {
   return Math.max(0, now - openedAt);
}

export function statusCopy(statusCode: number): {
   text: string;
   github: boolean;
} {
   if (statusCode === 429) {
      return {
         text: "You've sent a few already. Try again in a minute.",
         github: false,
      };
   }
   if (statusCode === 502 || statusCode === 503) {
      return { text: "Couldn't send right now.", github: true };
   }
   return { text: "Couldn't send. Try again.", github: false };
}

export function canSendFeedback(input: {
   trimmedMessageLength: number;
   emailOk: boolean;
   status: FeedbackSendStatus;
}): boolean {
   if (input.trimmedMessageLength < MESSAGE_MIN_LENGTH || !input.emailOk) {
      return false;
   }

   switch (input.status) {
      case 'sending':
      case 'success':
         return false;
      case 'idle':
      case 'error':
         return true;
      default: {
         const exhaustive: never = input.status;
         return exhaustive;
      }
   }
}

export function feedbackPostBody(input: {
   message: string;
   email: string;
   website: string;
   elapsedMs: number;
   page: string;
   theme: string;
   mode: string;
   userAgent: string;
}): {
   message: string;
   email: string;
   website: string;
   elapsedMs: number;
   context: {
      page: string;
      theme: string;
      mode: string;
      userAgent: string;
   };
} {
   return {
      message: input.message,
      email: input.email.trim(),
      website: input.website,
      elapsedMs: input.elapsedMs,
      context: {
         page: clipContext(input.page || '/'),
         theme: clipContext(input.theme || ''),
         mode: clipContext(input.mode),
         userAgent: clipContext(input.userAgent),
      },
   };
}
