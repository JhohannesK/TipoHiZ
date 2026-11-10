import { beforeEach, describe, expect, it } from 'vitest';
import { userConfigStore, wordStore } from '../../store';
import { initialWordState, resetStores } from '../../test/utils';
import { calculateStats } from './calculate';
import { setKeystrokeClock } from './clock';
import { MAX_EXTRA_LETTERS } from './types';
import {
   appendKeystroke,
   buildFinishedResult,
   classifyTypedKey,
   describeKeystrokeLog,
   testDuration,
} from './record';

describe('testDuration', () => {
   it('should use the configured limit for a timed test', () => {
      expect(testDuration([], 'time', 15)).toEqual({
         durationMs: 15_000,
         durationSeconds: 15,
      });
   });

   it('should ignore keystroke timestamps on a timed test', () => {
      expect(
         testDuration(
            [
               {
                  key: 'a',
                  expected: 'a',
                  kind: 'correct',
                  timestampMs: 0,
                  wordIndex: 0,
               },
               {
                  key: 'b',
                  expected: 'b',
                  kind: 'correct',
                  timestampMs: 800,
                  wordIndex: 0,
               },
            ],
            'time',
            15
         )
      ).toEqual({ durationMs: 15_000, durationSeconds: 15 });
   });

   it('should include the opening character gap on a words test', () => {
      expect(
         testDuration(
            [
               {
                  key: 'a',
                  expected: 'a',
                  kind: 'correct',
                  timestampMs: 0,
                  wordIndex: 0,
               },
               {
                  key: 'b',
                  expected: 'b',
                  kind: 'correct',
                  timestampMs: 800,
                  wordIndex: 0,
               },
            ],
            'words',
            30
         )
      ).toEqual({ durationMs: 1_600, durationSeconds: 1.6 });
   });

   it('should measure a words test from the earliest keystroke to the latest', () => {
      expect(
         testDuration(
            [
               {
                  key: 'a',
                  expected: 'a',
                  kind: 'correct',
                  timestampMs: 1200,
                  wordIndex: 0,
               },
               {
                  key: 'Backspace',
                  expected: 'a',
                  kind: 'backspace',
                  timestampMs: 400,
                  wordIndex: 0,
               },
            ],
            'words',
            30
         )
      ).toEqual({ durationMs: 1_600, durationSeconds: 1.6 });
   });

   it('should floor a words test with no elapsed time at 1ms', () => {
      expect(testDuration([], 'words', 30)).toEqual({
         durationMs: 1,
         durationSeconds: 0.001,
      });
      expect(
         testDuration(
            [
               {
                  key: 'a',
                  expected: 'a',
                  kind: 'correct',
                  timestampMs: 0,
                  wordIndex: 0,
               },
               {
                  key: 'b',
                  expected: 'b',
                  kind: 'correct',
                  timestampMs: 0,
                  wordIndex: 0,
               },
            ],
            'words',
            30
         )
      ).toEqual({ durationMs: 1, durationSeconds: 0.001 });
   });
});

describe('classifyTypedKey', () => {
   it('should mark a mismatch inside the word as incorrect', () => {
      expect(classifyTypedKey('cat', 'c', 'x')).toEqual({
         expected: 'a',
         kind: 'incorrect',
         blocked: false,
      });
   });

   it('should mark a letter past the word as extra, not incorrect', () => {
      expect(classifyTypedKey('hi', 'hi', 'x')).toEqual({
         expected: null,
         kind: 'extra',
         blocked: false,
      });
   });

   it('should block extras once the cap is reached', () => {
      const typed = `hi${'x'.repeat(MAX_EXTRA_LETTERS)}`;
      expect(classifyTypedKey('hi', typed, 'z')).toEqual({
         expected: null,
         kind: 'extra',
         blocked: true,
      });
      expect(
         classifyTypedKey('hi', `hi${'x'.repeat(MAX_EXTRA_LETTERS - 1)}`, 'z')
      ).toEqual({
         expected: null,
         kind: 'extra',
         blocked: false,
      });
   });
});

describe('buildFinishedResult', () => {
   beforeEach(() => {
      resetStores();
      let now = 0;
      setKeystrokeClock(() => {
         const current = now;
         now += 200;
         return current;
      });
      wordStore.setState({
         ...initialWordState,
         wordList: ['ab', 'cd'],
         activeWord: 'ab',
      });
      for (const key of ['a', 'b', ' ', 'c', 'd']) {
         appendKeystroke({
            key,
            expected: key === ' ' ? ' ' : key,
            kind: 'correct',
            wordIndex: key === 'c' || key === 'd' ? 1 : 0,
         });
      }
   });

   it('should score a timed test against the configured duration', () => {
      userConfigStore.setState({ category: 'time', time: 30 });

      const result = buildFinishedResult();
      const stats = calculateStats({
         log: wordStore.getState().keystrokeLog,
         words: ['ab', 'cd'],
         durationMs: 30_000,
      });

      expect(result?.durationSeconds).toBe(30);
      expect(result?.wordCount).toBe(2);
      expect(result?.stats).toEqual(stats);
      expect(result?.stats.rawWpm).toBeCloseTo(2);
   });

   it('should score a words test with elapsed time from the keystroke log', () => {
      userConfigStore.setState({
         category: 'words',
         wordCount: 10,
         time: 30,
      });

      const result = buildFinishedResult();
      const log = wordStore.getState().keystrokeLog;
      const stats = calculateStats({
         log,
         words: ['ab', 'cd'],
         durationMs: 1_000,
      });

      expect(result?.category).toBe('words');
      expect(result?.durationSeconds).toBe(1);
      expect(result?.durationSeconds).not.toBe(30);
      expect(result?.wordCount).toBe(2);
      expect(result?.words).toEqual(['ab', 'cd']);
      expect(result?.stats).toEqual(stats);
      expect(result?.stats.rawWpm).toBe(60);
      expect(result?.stats.samples).toHaveLength(1);
   });

   it('should record the language selected before a words test finishes', () => {
      userConfigStore.setState({
         category: 'words',
         language: 'english',
      });
      userConfigStore.setState({ language: 'spanish' });

      expect(buildFinishedResult()?.language).toBe('spanish');
   });
});

describe('buildFinishedResult empty log', () => {
   beforeEach(() => {
      resetStores();
   });

   it('should return null when nothing was typed so a blank result is not saved', () => {
      wordStore.setState({
         ...initialWordState,
         wordList: ['ab'],
         activeWord: 'ab',
         keystrokeLog: [],
      });
      userConfigStore.setState({ category: 'words', time: 30 });

      expect(buildFinishedResult()).toBeNull();
   });
});

describe('describeKeystrokeLog', () => {
   it('should count an in-progress last word and keep later bank words out of stats', () => {
      const log = [
         {
            key: 'c',
            expected: 'c',
            kind: 'correct' as const,
            timestampMs: 0,
            wordIndex: 0,
         },
         {
            key: 'a',
            expected: 'a',
            kind: 'correct' as const,
            timestampMs: 80,
            wordIndex: 0,
         },
         {
            key: 't',
            expected: 't',
            kind: 'correct' as const,
            timestampMs: 160,
            wordIndex: 0,
         },
         {
            key: ' ',
            expected: ' ',
            kind: 'correct' as const,
            timestampMs: 200,
            wordIndex: 0,
         },
         {
            key: 'd',
            expected: 'd',
            kind: 'correct' as const,
            timestampMs: 280,
            wordIndex: 1,
         },
      ];

      const described = describeKeystrokeLog(log, ['cat', 'dog', 'bird'], 15);

      expect(described.words).toEqual(['cat', 'dog']);
      expect(described.wordCount).toBe(2);
      expect(described.stats.typedEntries).toBe(5);
      expect(described.stats.missed).toBe(0);
   });

   it('should count a submitted short word as finished even when the next word is empty', () => {
      const log = [
         {
            key: 'h',
            expected: 'h',
            kind: 'correct' as const,
            timestampMs: 0,
            wordIndex: 0,
         },
         {
            key: 'i',
            expected: 'i',
            kind: 'correct' as const,
            timestampMs: 50,
            wordIndex: 0,
         },
         {
            key: ' ',
            expected: ' ',
            kind: 'correct' as const,
            timestampMs: 80,
            wordIndex: 0,
         },
      ];

      const described = describeKeystrokeLog(log, ['hi', 'there'], 15);

      expect(described.words).toEqual(['hi', 'there']);
      expect(described.wordCount).toBe(1);
      expect(described.stats.missed).toBe(0);
   });
});
