import { describe, expect, it } from 'vitest';
import {
   canSendFeedback,
   clipContext,
   elapsedSinceOpen,
   feedbackModeLabel,
   feedbackPostBody,
   remainingFillWait,
   statusCopy,
} from './client';
import { CONTEXT_MAX, MIN_FILL_MS, feedbackContextSchema } from './schema';

describe('statusCopy', () => {
   it('should hide the GitHub link on 429 so rate-limit looks like a user pause', () => {
      expect(statusCopy(429)).toEqual({
         text: "You've sent a few already. Try again in a minute.",
         github: false,
      });
   });

   it.each([502, 503])(
      'should offer a GitHub report link when the server is down (%s)',
      (statusCode) => {
         expect(statusCopy(statusCode)).toEqual({
            text: "Couldn't send right now.",
            github: true,
         });
      }
   );

   it.each([400, 401, 500])(
      'should keep a generic retry for other failures (%s)',
      (statusCode) => {
         expect(statusCopy(statusCode)).toEqual({
            text: "Couldn't send. Try again.",
            github: false,
         });
      }
   );
});

describe('remainingFillWait', () => {
   it('should wait the leftover min-fill time so a fast form does not POST early', () => {
      expect(remainingFillWait(0, 0)).toBe(MIN_FILL_MS);
      expect(remainingFillWait(0, 1_000)).toBe(2_000);
   });

   it('should not wait once the dialog has been open for min-fill or longer', () => {
      expect(remainingFillWait(0, MIN_FILL_MS)).toBe(0);
      expect(remainingFillWait(0, MIN_FILL_MS + 1_500)).toBe(0);
   });

   it('should treat a clock that moved backwards as a full remaining wait', () => {
      expect(remainingFillWait(100, 50)).toBe(MIN_FILL_MS + 50);
   });
});

describe('elapsedSinceOpen', () => {
   it('should report elapsed ms after the wait so the server speed gate can match', () => {
      expect(elapsedSinceOpen(0, MIN_FILL_MS)).toBe(MIN_FILL_MS);
      expect(elapsedSinceOpen(10, 3_510)).toBe(3_500);
   });

   it('should floor at 0 when the clock moved backwards', () => {
      expect(elapsedSinceOpen(100, 50)).toBe(0);
   });
});

describe('clipContext and feedbackPostBody', () => {
   it('should cap context fields at CONTEXT_MAX so the request still parses', () => {
      const long = 'p'.repeat(CONTEXT_MAX + 40);
      const clipped = clipContext(long);

      expect(clipped).toHaveLength(CONTEXT_MAX);
      expect(
         feedbackContextSchema.safeParse({
            page: clipped,
            theme: clipped,
            mode: clipped,
            userAgent: clipped,
         }).success
      ).toBe(true);
      expect(
         feedbackContextSchema.safeParse({
            page: long,
            theme: '',
            mode: '',
            userAgent: '',
         }).success
      ).toBe(false);
   });

   it('should trim email, keep the honeypot as typed, and fill a blank page', () => {
      const body = feedbackPostBody({
         message: '  caret jumps after restart  ',
         email: '  person@example.com  ',
         website: 'https://spam.example',
         elapsedMs: 5_000,
         page: '',
         theme: '',
         mode: 'time 30',
         userAgent: 'Mozilla/5.0',
      });

      expect(body).toEqual({
         message: '  caret jumps after restart  ',
         email: 'person@example.com',
         website: 'https://spam.example',
         elapsedMs: 5_000,
         context: {
            page: '/',
            theme: '',
            mode: 'time 30',
            userAgent: 'Mozilla/5.0',
         },
      });
   });
});

describe('feedbackModeLabel', () => {
   it('should label words mode from wordCount, not config.time', () => {
      expect(
         feedbackModeLabel({ category: 'words', time: 15, wordCount: 50 })
      ).toBe('words 50');
   });

   it('should label time mode and unknown categories from config.time', () => {
      expect(
         feedbackModeLabel({ category: 'time', time: 30, wordCount: 25 })
      ).toBe('time 30');
      expect(
         feedbackModeLabel({ category: 'quote', time: 60, wordCount: 25 })
      ).toBe('time 60');
   });
});

describe('canSendFeedback', () => {
   it('should block short messages, bad emails, in-flight sends, and success', () => {
      expect(
         canSendFeedback({
            trimmedMessageLength: 9,
            emailOk: true,
            status: 'idle',
         })
      ).toBe(false);
      expect(
         canSendFeedback({
            trimmedMessageLength: 10,
            emailOk: false,
            status: 'idle',
         })
      ).toBe(false);
      expect(
         canSendFeedback({
            trimmedMessageLength: 10,
            emailOk: true,
            status: 'sending',
         })
      ).toBe(false);
      expect(
         canSendFeedback({
            trimmedMessageLength: 10,
            emailOk: true,
            status: 'success',
         })
      ).toBe(false);
   });

   it('should allow a retry after an error', () => {
      expect(
         canSendFeedback({
            trimmedMessageLength: 10,
            emailOk: true,
            status: 'error',
         })
      ).toBe(true);
      expect(
         canSendFeedback({
            trimmedMessageLength: 10,
            emailOk: true,
            status: 'idle',
         })
      ).toBe(true);
   });
});
