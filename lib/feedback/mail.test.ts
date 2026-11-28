import { afterEach, describe, expect, it } from 'vitest';
import { feedbackMailContent, feedbackMailEnv, honeypotFilled } from './mail';

const context = {
   page: '/',
   theme: 'light-orange',
   mode: 'time 30',
   userAgent: 'TestAgent',
};

describe('honeypotFilled', () => {
   it('should treat a missing or empty website as a real submission', () => {
      expect(honeypotFilled({ message: 'caret jumps' })).toBe(false);
      expect(honeypotFilled({ website: '' })).toBe(false);
      expect(honeypotFilled({ website: '   ' })).toBe(false);
      expect(honeypotFilled(null)).toBe(false);
      expect(honeypotFilled('https://spam.example')).toBe(false);
   });

   it('should ignore a non-string website so type confusion cannot trip the honeypot', () => {
      expect(honeypotFilled({ website: 1 })).toBe(false);
      expect(honeypotFilled({ website: true })).toBe(false);
      expect(
         honeypotFilled({ website: { href: 'https://spam.example' } })
      ).toBe(false);
   });

   it('should drop a filled website honeypot before mail is built', () => {
      expect(honeypotFilled({ website: 'https://spam.example' })).toBe(true);
   });
});

describe('feedbackMailEnv', () => {
   const envKeys = [
      'RESEND_API_KEY',
      'FEEDBACK_TO_EMAIL',
      'FEEDBACK_FROM_EMAIL',
   ] as const;

   function setCompleteEnv(): void {
      process.env.RESEND_API_KEY = 'test-resend-key';
      process.env.FEEDBACK_TO_EMAIL = 'kdomeh@mail.grokbot.com';
      process.env.FEEDBACK_FROM_EMAIL = 'feedback@tipohiz.test';
   }

   afterEach(() => {
      for (const key of envKeys) {
         delete process.env[key];
      }
   });

   it('should require api key, to, and from before Resend is called', () => {
      setCompleteEnv();

      expect(feedbackMailEnv()).toEqual({
         apiKey: 'test-resend-key',
         to: 'kdomeh@mail.grokbot.com',
         from: 'feedback@tipohiz.test',
      });
   });

   it.each(envKeys)(
      'should fail closed when %s is missing or blank',
      (missing) => {
         setCompleteEnv();
         delete process.env[missing];
         expect(feedbackMailEnv()).toBeUndefined();

         setCompleteEnv();
         process.env[missing] = '';
         expect(feedbackMailEnv()).toBeUndefined();
      }
   );
});

describe('feedbackMailContent', () => {
   it('should escape markup in the message and context before inserting <br>', () => {
      const mail = feedbackMailContent({
         message: '</p>\n<script>alert(1)</script>',
         email: 'person@example.com',
         context: {
            page: '/results?q=<img src=x onerror=alert(1)>',
            theme: 'dark & "quoted"',
            mode: 'words <50>',
            userAgent: 'Mozilla/5.0; <Not)A;Brand',
         },
      });

      expect(mail.html).toContain(
         '&lt;/p&gt;<br>&lt;script&gt;alert(1)&lt;/script&gt;'
      );
      expect(mail.html).not.toContain('<script>');
      expect(mail.html).not.toContain('<img src=x');
      expect(mail.html).toContain(
         'Page: /results?q=&lt;img src=x onerror=alert(1)&gt;'
      );
      expect(mail.html).toContain('Theme: dark &amp; &quot;quoted&quot;');
      expect(mail.html).toContain('Mode: words &lt;50&gt;');
      expect(mail.html).toContain('Browser: Mozilla/5.0; &lt;Not)A;Brand');
      expect(mail.text).toContain('</p>\n<script>alert(1)</script>');
      expect(mail.text).toContain(
         'Page: /results?q=<img src=x onerror=alert(1)>'
      );
      expect(mail.replyTo).toBe('person@example.com');
   });

   it('should omit replyTo and show (none) when the email is blank', () => {
      const mail = feedbackMailContent({
         message: 'The caret jumps after a restart on words mode.',
         email: '   ',
         context,
      });

      expect(mail.replyTo).toBeUndefined();
      expect(mail.text).toContain('Email: (none)');
      expect(mail.html).toContain('Email: (none)');
      expect(mail.html).not.toContain('person@example.com');
   });

   it('should keep a trimmed reply address in both bodies', () => {
      const mail = feedbackMailContent({
         message: 'The caret jumps after a restart on words mode.',
         email: '  person@example.com  ',
         context,
      });

      expect(mail.replyTo).toBe('person@example.com');
      expect(mail.text).toContain('Email: person@example.com');
      expect(mail.html).toContain('Email: person@example.com');
   });
});
