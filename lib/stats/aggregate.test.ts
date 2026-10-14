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
});
