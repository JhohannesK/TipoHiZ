import { describe, expect, it } from 'vitest';
import {
   mergeResults,
   resultFromSubmission,
   statsFromResult,
   summarizeResults,
} from './aggregate';
import { compactLog } from './types';
import type { Keystroke, ResultSubmission, SavedTestResult } from './types';

function submission(
   id: string,
   createdAt: string,
   typed: string,
   wpmOverride?: number
): SavedTestResult {
   const log: Keystroke[] = [...typed].map((key, index) => ({
      key,
      expected: key,
      kind: 'correct',
      timestampMs: index * 100,
      wordIndex: 0,
   }));
   const input: ResultSubmission = {
      id,
      createdAt,
      mode: 'default',
      category: 'time',
      language: 'english',
      durationSeconds: 15,
      wordCount: 1,
      words: [typed],
      log: compactLog(log),
   };
   const saved = resultFromSubmission(input);
   if (wpmOverride === undefined) return saved;
   return {
      ...saved,
      stats: {
         ...saved.stats,
         wpm: wpmOverride,
      },
   };
}

describe('saved result aggregation', () => {
   it('should recompute stats from the compact log', () => {
      const saved = submission('result-1', '2026-10-13T00:00:00.000Z', 'abcde');
      const again = statsFromResult(saved);

      expect(again).toEqual(saved.stats);
      expect(saved.stats.typedEntries).toBe(5);
      expect(saved.stats.accuracy).toBe(100);
      expect(saved.stats.wpm).toBeGreaterThan(0);
   });

   it('should ignore a stale stored wpm when ranking personal bests', () => {
      const honest = submission('honest', '2026-10-13T00:00:00.000Z', 'abcde');
      const stale = submission(
         'stale',
         '2026-10-13T00:01:00.000Z',
         'ab',
         9_999
      );
      const summary = summarizeResults([stale, honest]);

      expect(summary.personalBests.wpm).toBeCloseTo(honest.stats.wpm, 5);
      expect(summary.personalBests.wpm).not.toBe(9_999);
      expect(summary.tests).toBe(2);
      expect(summary.recent[0]?.id).toBe('stale');
      expect(summary.recent[0]?.wpm).toBeCloseTo(statsFromResult(stale).wpm, 5);
      expect(summary.recent[0]?.wpm).not.toBe(9_999);
      expect(summary.averageWpm).toBeCloseTo(
         (statsFromResult(honest).wpm + statsFromResult(stale).wpm) / 2,
         5
      );
   });

   it('should return empty bests when there are no results', () => {
      const summary = summarizeResults([]);

      expect(summary.tests).toBe(0);
      expect(summary.averageWpm).toBe(0);
      expect(summary.personalBests).toEqual({
         wpm: null,
         rawWpm: null,
         accuracy: null,
         consistency: null,
      });
      expect(summary.recent).toEqual([]);
      expect(summary.perKey).toEqual([]);
   });

   it('should merge by id and keep the newest test first', () => {
      const older = submission('same', '2026-10-13T00:00:00.000Z', 'abcde');
      const newer = submission(
         'same',
         '2026-10-14T00:00:00.000Z',
         'abcdefghij'
      );
      const other = submission('other', '2026-10-12T00:00:00.000Z', 'ab');
      const merged = mergeResults([older, other], [newer]);

      expect(merged.map((result) => result.id)).toEqual(['same', 'other']);
      expect(merged[0]?.createdAt).toBe(older.createdAt);
      expect(statsFromResult(merged[0] ?? older).typedEntries).toBe(5);
   });

   it('should keep the primary body when extras repeat an id', () => {
      const primary = submission('same', '2026-10-13T00:00:00.000Z', 'abcde');
      const extra = submission(
         'same',
         '2026-10-14T00:00:00.000Z',
         'abcdefghij'
      );
      const merged = mergeResults([primary], [extra]);

      expect(merged).toHaveLength(1);
      expect(merged[0]?.createdAt).toBe(primary.createdAt);
      expect(statsFromResult(merged[0] ?? primary).typedEntries).toBe(5);
   });

   it('should ignore stale stored rawWpm accuracy and consistency when ranking bests', () => {
      const honest = submission('honest', '2026-10-13T00:00:00.000Z', 'abcde');
      const stale = {
         ...submission('stale', '2026-10-13T00:01:00.000Z', 'ab'),
         stats: {
            ...submission('stale', '2026-10-13T00:01:00.000Z', 'ab').stats,
            rawWpm: 9_999,
            accuracy: 1,
            consistency: 1,
         },
      };
      const summary = summarizeResults([stale, honest]);
      const honestStats = statsFromResult(honest);
      const staleStats = statsFromResult(stale);

      expect(summary.personalBests.rawWpm).toBeCloseTo(honestStats.rawWpm, 5);
      expect(summary.personalBests.accuracy).toBeCloseTo(
         Math.max(honestStats.accuracy, staleStats.accuracy),
         5
      );
      expect(summary.personalBests.consistency).toBeCloseTo(
         Math.max(honestStats.consistency, staleStats.consistency),
         5
      );
      expect(summary.personalBests.rawWpm).not.toBe(9_999);
      expect(summary.personalBests.accuracy).not.toBe(1);
      expect(summary.personalBests.consistency).not.toBe(1);
   });

   it('should sum per-key counts across tests instead of averaging accuracy', () => {
      const first = submission('first', '2026-10-13T00:00:00.000Z', 'aa');
      const second = submission('second', '2026-10-13T00:01:00.000Z', 'ab');
      const summary = summarizeResults([first, second]);

      expect(summary.perKey).toEqual([
         {
            key: 'a',
            correct: 3,
            incorrect: 0,
            extra: 0,
            accuracy: 100,
         },
         {
            key: 'b',
            correct: 1,
            incorrect: 0,
            extra: 0,
            accuracy: 100,
         },
      ]);
   });
});
