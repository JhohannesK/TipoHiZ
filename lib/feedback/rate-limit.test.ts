import { describe, expect, it } from 'vitest';
import { feedbackRateDecision, hashIp } from './rate-limit';

describe('feedback rate decision', () => {
   const now = new Date('2026-11-21T12:00:00.000Z');

   function minutesAgo(minutes: number): Date {
      return new Date(now.getTime() - minutes * 60 * 1000);
   }

   it('should allow a first submission', () => {
      expect(feedbackRateDecision([], now)).toBe('ok');
   });

   it('should limit the fourth submission inside ten minutes', () => {
      const stamps = [1, 2, 3].map((minutes) => minutesAgo(minutes));

      expect(feedbackRateDecision(stamps, now)).toBe('limited');
   });

   it('should allow three submissions once they age past ten minutes', () => {
      const stamps = [11, 12, 13].map((minutes) => minutesAgo(minutes));

      expect(feedbackRateDecision(stamps, now)).toBe('ok');
   });

   it('should limit the twenty-first submission inside a day', () => {
      const stamps = Array.from({ length: 20 }, () => minutesAgo(30));

      expect(feedbackRateDecision(stamps, now)).toBe('limited');
   });

   it('should hash an ip without keeping the raw value', () => {
      const hash = hashIp('203.0.113.8');

      expect(hash).toHaveLength(64);
      expect(hash).not.toContain('203.0.113.8');
      expect(hashIp('203.0.113.8')).toBe(hash);
   });
});
