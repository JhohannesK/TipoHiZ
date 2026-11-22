import { describe, expect, it } from 'vitest';
import {
   escapeHtml,
   feedbackBodySchema,
   feedbackSubject,
   optionalEmailOk,
} from './schema';

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

describe('feedbackBodySchema elapsedMs', () => {
   it.each([
      ['NaN', Number.NaN],
      ['Infinity', Number.POSITIVE_INFINITY],
      ['-Infinity', Number.NEGATIVE_INFINITY],
      ['negative', -1],
      ['null', null],
   ])('should reject %s elapsedMs', (_label, elapsedMs) => {
      expect(
         feedbackBodySchema.safeParse(validBody({ elapsedMs })).success
      ).toBe(false);
   });

   it('should reject a missing elapsedMs', () => {
      const { message, email, context } = validBody();

      expect(
         feedbackBodySchema.safeParse({ message, email, context }).success
      ).toBe(false);
   });

   it('should accept elapsedMs 0 so the route can fail closed as too fast', () => {
      const parsed = feedbackBodySchema.safeParse(validBody({ elapsedMs: 0 }));

      expect(parsed.success).toBe(true);
      if (parsed.success) {
         expect(parsed.data.elapsedMs).toBe(0);
      }
   });
});

describe('optionalEmailOk', () => {
   it.each(['', '   '])('should accept an empty email %j', (value) => {
      expect(optionalEmailOk(value)).toBe(true);
   });

   it('should accept a trimmed valid email', () => {
      expect(optionalEmailOk('  person@example.com  ')).toBe(true);
   });

   it('should reject a non-email string', () => {
      expect(optionalEmailOk('not-an-email')).toBe(false);
   });

   it('should reject an email longer than 254 characters', () => {
      const local = 'a'.repeat(64);
      const domain = `${'b'.repeat(190)}.com`;
      expect(optionalEmailOk(`${local}@${domain}`)).toBe(false);
   });
});

describe('escapeHtml', () => {
   it('should escape markup so a message cannot inject email HTML', () => {
      expect(escapeHtml(`<script>alert("x")</script> & <img src='x'>`)).toBe(
         "&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt; &amp; &lt;img src='x'&gt;"
      );
   });
});

describe('feedbackSubject', () => {
   it('should strip CR/LF and cap the preview at 60 characters', () => {
      const subject = feedbackSubject('line one\r\nline two\ninject');

      expect(subject).toBe('TipoHiZ feedback: line one line two inject');
      expect(subject).not.toMatch(/[\r\n]/);
      expect(feedbackSubject('a'.repeat(80))).toBe(
         `TipoHiZ feedback: ${'a'.repeat(60)}`
      );
   });
});
