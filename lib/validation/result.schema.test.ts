import { describe, expect, it } from 'vitest';
import { resultFromSubmission } from '../stats/aggregate';
import { migrateResultsSchema, resultSubmissionSchema } from './result.schema';

const submission = {
   id: 'result-1234',
   createdAt: '2026-10-13T00:00:00.000Z',
   mode: 'default',
   category: 'time',
   language: 'english',
   durationSeconds: 15,
   wordCount: 1,
   words: ['ab'],
   log: [
      ['a', 'a', 'correct', 0, 0],
      ['x', 'b', 'incorrect', 40, 0],
   ],
};

describe('result submission schema', () => {
   it('should accept a compact log and recompute stats from it', () => {
      const parsed = resultSubmissionSchema.parse({
         ...submission,
         wpm: 9_999,
      });
      const saved = resultFromSubmission(parsed);

      expect(saved.stats.wpm).not.toBe(9_999);
      expect(saved.stats.incorrect).toBe(1);
      expect(saved.stats.typedEntries).toBe(2);
   });

   it('should reject a log past the cap', () => {
      const parsed = resultSubmissionSchema.safeParse({
         ...submission,
         log: Array.from({ length: 20_001 }, () => submission.log[0]),
      });

      expect(parsed.success).toBe(false);
   });

   it('should reject a migrate payload over 50 results', () => {
      const parsed = migrateResultsSchema.safeParse({
         results: Array.from({ length: 51 }, () => submission),
      });

      expect(parsed.success).toBe(false);
   });

   it.each([0, -1, 3601])(
      'should reject durationSeconds %s',
      (durationSeconds) => {
         const parsed = resultSubmissionSchema.safeParse({
            ...submission,
            durationSeconds,
         });
         expect(parsed.success).toBe(false);
      }
   );

   it('should accept the duration and log index bounds', () => {
      const parsed = resultSubmissionSchema.safeParse({
         ...submission,
         durationSeconds: 3600,
         log: [['a', 'a', 'correct', 0, 10_000]],
      });
      expect(parsed.success).toBe(true);
   });

   it('should reject a short id and an empty keystroke key', () => {
      expect(
         resultSubmissionSchema.safeParse({ ...submission, id: 'short' })
            .success
      ).toBe(false);
      expect(
         resultSubmissionSchema.safeParse({
            ...submission,
            log: [['', 'a', 'correct', 0, 0]],
         }).success
      ).toBe(false);
   });

   it('should reject a compact tuple with a negative timestamp or wordIndex', () => {
      expect(
         resultSubmissionSchema.safeParse({
            ...submission,
            log: [['a', 'a', 'correct', -1, 0]],
         }).success
      ).toBe(false);
      expect(
         resultSubmissionSchema.safeParse({
            ...submission,
            log: [['a', 'a', 'correct', 0, 10_001]],
         }).success
      ).toBe(false);
   });
});
