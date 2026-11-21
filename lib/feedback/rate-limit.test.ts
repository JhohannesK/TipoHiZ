import { describe, expect, it, vi } from 'vitest';
import {
   enforceFeedbackRate,
   feedbackRateDecision,
   hashIp,
   resetFeedbackRateIndexForTests,
} from './rate-limit';

const { createIndex, insertOne, toArray } = vi.hoisted(() => ({
   createIndex: vi.fn(),
   insertOne: vi.fn(),
   toArray: vi.fn(),
}));

vi.mock('@/lib/stats/repository', () => ({
   sharedMongoDatabase: () => ({
      collection: () => ({
         createIndex,
         insertOne,
         find: () => ({
            project: () => ({ toArray }),
         }),
      }),
   }),
}));

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

   it('should attempt the TTL index once when creation fails', async () => {
      resetFeedbackRateIndexForTests();
      createIndex.mockRejectedValue(
         Object.assign(new Error('DatabaseDifferCase'), {
            name: 'MongoServerError',
            code: 13297,
         })
      );
      toArray.mockResolvedValue([]);
      insertOne.mockResolvedValue({ acknowledged: true });
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const request = new Request('http://localhost/api/feedback', {
         headers: { 'x-real-ip': '203.0.113.8' },
      });

      await expect(enforceFeedbackRate(request)).resolves.toBe('ok');
      await expect(enforceFeedbackRate(request)).resolves.toBe('ok');
      await Promise.resolve();

      expect(createIndex).toHaveBeenCalledTimes(1);
      expect(insertOne).toHaveBeenCalledTimes(2);
      const logged = JSON.stringify(errorSpy.mock.calls);
      expect(logged).toContain('13297');
      expect(logged).not.toContain('203.0.113.8');
   });

   it('should hash an ip without keeping the raw value', () => {
      const hash = hashIp('203.0.113.8');

      expect(hash).toHaveLength(64);
      expect(hash).not.toContain('203.0.113.8');
      expect(hashIp('203.0.113.8')).toBe(hash);
   });
});
