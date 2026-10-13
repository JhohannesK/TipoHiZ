// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { savedResultFromDocument } from './repository';

describe('savedResultFromDocument', () => {
   it('should recompute wpm from the stored log', () => {
      const saved = savedResultFromDocument({
         _id: 'result-1234',
         userId: 'user-1',
         createdAt: new Date('2026-10-13T00:00:00.000Z'),
         mode: 'default',
         category: 'time',
         language: 'english',
         durationSeconds: 15,
         wordCount: 1,
         words: ['abcde'],
         log: [
            ['a', 'a', 'correct', 0, 0],
            ['b', 'b', 'correct', 20, 0],
            ['c', 'c', 'correct', 40, 0],
            ['d', 'd', 'correct', 60, 0],
            ['e', 'e', 'correct', 80, 0],
         ],
         wpm: 1,
         rawWpm: 1,
         accuracy: 1,
         consistency: 1,
         perKey: [],
         samples: [],
      });

      expect(saved.id).toBe('result-1234');
      expect(saved.stats.typedEntries).toBe(5);
      expect(saved.stats.accuracy).toBe(100);
      expect(saved.stats.wpm).not.toBe(1);
      expect(saved.stats.wpm).toBeGreaterThan(1);
   });
});
