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

   it('should use the last keystroke for a words test', () => {
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
      ).toEqual({ durationMs: 800, durationSeconds: 0.8 });
   });

   it('should use the max timestamp on a words test even if the last event is earlier', () => {
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
      ).toEqual({ durationMs: 1200, durationSeconds: 1.2 });
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
         durationMs: 800,
      });

      expect(result?.category).toBe('words');
      expect(result?.durationSeconds).toBeCloseTo(0.8);
      expect(result?.durationSeconds).not.toBe(30);
      expect(result?.wordCount).toBe(2);
      expect(result?.words).toEqual(['ab', 'cd']);
      expect(result?.stats).toEqual(stats);
      expect(result?.stats.rawWpm).toBeCloseTo(75);
      expect(result?.stats.samples).toHaveLength(1);
   });
});
