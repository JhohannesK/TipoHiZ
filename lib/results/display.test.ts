import { describe, expect, it } from 'vitest';
import { resultFromSubmission, statsFromResult } from '@/lib/stats/aggregate';
import { calculateStats } from '@/lib/stats/calculate';
import type { Keystroke, SavedTestResult } from '@/lib/stats/types';
import {
   displayedResult,
   formatElapsedStat,
   formatTestMode,
   sameKeystrokeLog,
} from './display';

const config = {
   time: 15,
   category: 'time',
   type: 'default',
   language: 'english',
};

function stroke(
   key: string,
   expected: string | null,
   timestampMs: number
): Keystroke {
   return {
      key,
      expected,
      kind:
         expected === null
            ? 'extra'
            : key === expected
            ? 'correct'
            : 'incorrect',
      timestampMs,
      wordIndex: 0,
   };
}

function savedFrom(log: Keystroke[], words: string[]): SavedTestResult {
   return resultFromSubmission({
      id: 'result-1',
      createdAt: '2026-10-13T00:00:00.000Z',
      mode: 'default',
      category: 'time',
      language: 'english',
      durationSeconds: 15,
      wordCount: 1,
      words,
      log: log.map((entry) => [
         entry.key,
         entry.expected,
         entry.kind,
         entry.timestampMs,
         entry.wordIndex,
      ]),
   });
}

describe('displayedResult', () => {
   it('should ignore a stored wpm and recompute the saved log', () => {
      const log = [stroke('a', 'a', 100), stroke('x', 'b', 200)];
      const saved = savedFrom(log, ['ab']);
      const tampered: SavedTestResult = {
         ...saved,
         stats: { ...saved.stats, wpm: 9999, accuracy: 1, rawWpm: 9999 },
      };

      const display = displayedResult({
         liveLog: log,
         liveWords: ['ab', 'unused'],
         config,
         saved: tampered,
      });

      expect(display.stats).toEqual(statsFromResult(saved));
      expect(display.stats.wpm).not.toBe(9999);
      expect(display.durationSeconds).toBe(15);
      expect(display.stats.incorrect).toBe(1);
   });

   it('should score the live log when it is a different test', () => {
      const saved = savedFrom([stroke('a', 'a', 100)], ['a']);
      const liveLog = [stroke('z', 'q', 50), stroke('z', null, 80)];
      const display = displayedResult({
         liveLog,
         liveWords: ['q'],
         config,
         saved,
      });

      expect(sameKeystrokeLog(liveLog, saved.log)).toBe(false);
      expect(display.stats).toEqual(
         calculateStats({
            log: liveLog,
            words: ['q'],
            durationMs: 15_000,
         })
      );
      expect(display.stats.incorrect).toBe(1);
      expect(display.stats.extra).toBe(1);
   });

   it('should show the latest saved test when the live log is empty', () => {
      const saved = savedFrom(
         [stroke('a', 'a', 100), stroke('b', 'b', 200)],
         ['ab']
      );
      const display = displayedResult({
         liveLog: [],
         liveWords: [],
         config: { ...config, time: 30 },
         saved,
      });

      expect(display.stats.typedEntries).toBe(2);
      expect(display.durationSeconds).toBe(15);
      expect(display.stats.wpm).toBe(statsFromResult(saved).wpm);
   });

   it('should score a words run from the elapsed keystroke time', () => {
      const liveLog = [stroke('a', 'a', 100), stroke('b', 'b', 800)];
      const display = displayedResult({
         liveLog,
         liveWords: ['ab'],
         config: { ...config, time: 30, category: 'words' },
         saved: null,
      });

      expect(display.durationSeconds).toBeCloseTo(0.8);
      expect(display.stats).toEqual(
         calculateStats({
            log: liveLog,
            words: ['ab'],
            durationMs: 800,
         })
      );
      expect(display.durationSeconds).not.toBe(30);
   });

   it('should use the configured duration when nothing has been saved', () => {
      const display = displayedResult({
         liveLog: [],
         liveWords: [],
         config,
         saved: null,
      });

      expect(display.durationSeconds).toBe(15);
      expect(display.stats.wpm).toBe(0);
      expect(display.stats.samples).toHaveLength(15);
      expect(formatTestMode(display)).toBe('time 15s english default');
   });
});

describe('formatElapsedStat', () => {
   it('should show real elapsed seconds to two decimals', () => {
      expect(formatElapsedStat(21.95)).toBe('21.95s');
      expect(formatElapsedStat(14)).toBe('14.00s');
      expect(formatElapsedStat(14.4)).toBe('14.40s');
      expect(formatElapsedStat(0)).toBe('0.00s');
   });
});

describe('formatTestMode', () => {
   it('should include the word count for a words test', () => {
      expect(
         formatTestMode({
            category: 'words',
            mode: 'punctuation',
            language: 'spanish',
            durationSeconds: 14.2,
            wordCount: 25,
         })
      ).toBe('words 25');
   });
});
