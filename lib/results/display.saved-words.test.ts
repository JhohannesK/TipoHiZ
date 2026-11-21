import { describe, expect, it } from 'vitest';
import { resultFromSubmission, statsFromResult } from '@/lib/stats/aggregate';
import { calculateStats } from '@/lib/stats/calculate';
import type { Keystroke, SavedTestResult } from '@/lib/stats/types';
import { displayedResult, formatTestMode, sameKeystrokeLog } from './display';

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

function savedWordsFrom(
   log: Keystroke[],
   words: string[],
   over: Partial<SavedTestResult> = {}
): SavedTestResult {
   return {
      ...resultFromSubmission({
         id: 'result-words-1',
         createdAt: '2026-10-13T00:00:00.000Z',
         mode: 'default',
         category: 'words',
         language: 'english',
         durationSeconds: 1.4,
         wordCount: words.length,
         words,
         log: log.map((entry) => [
            entry.key,
            entry.expected,
            entry.kind,
            entry.timestampMs,
            entry.wordIndex,
         ]),
      }),
      ...over,
   };
}

describe('displayedResult saved words duration', () => {
   it('should keep a matching words run on the saved elapsed time after config.time changes', () => {
      const log = [stroke('a', 'a', 100), stroke('b', 'b', 800)];
      const saved = savedWordsFrom(log, ['ab'], { wordCount: 10 });
      const display = displayedResult({
         liveLog: log,
         liveWords: ['ab'],
         config: {
            time: 60,
            category: 'words',
            type: 'punctuation',
            language: 'french',
         },
         saved,
      });

      expect(sameKeystrokeLog(log, saved.log)).toBe(true);
      expect(display.category).toBe('words');
      expect(display.durationSeconds).toBe(1.4);
      expect(display.durationSeconds).not.toBe(60);
      expect(display.wordCount).toBe(10);
      expect(display.language).toBe('english');
      expect(display.mode).toBe('default');
      expect(display.stats).toEqual(statsFromResult(saved));
      expect(display.stats.wpm).not.toBe(
         calculateStats({
            log,
            words: ['ab'],
            durationMs: 60_000,
         }).wpm
      );
      expect(formatTestMode(display)).toBe('words 10 english default');
   });

   it('should keep saved words metadata when the live log is empty and the store is now timed', () => {
      const log = [stroke('h', 'h', 100), stroke('i', 'i', 400)];
      const saved = savedWordsFrom(log, ['hi'], {
         language: 'spanish',
         mode: 'punctuation',
         wordCount: 25,
      });
      const display = displayedResult({
         liveLog: [],
         liveWords: [],
         config: {
            time: 60,
            category: 'time',
            type: 'default',
            language: 'french',
         },
         saved,
      });

      expect(display.category).toBe('words');
      expect(display.mode).toBe('punctuation');
      expect(display.language).toBe('spanish');
      expect(display.wordCount).toBe(25);
      expect(display.durationSeconds).toBe(1.4);
      expect(display.stats).toEqual(statsFromResult(saved));
      expect(formatTestMode(display)).toBe('words 25 spanish punctuation');
   });
});
