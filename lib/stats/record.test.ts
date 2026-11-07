import { beforeEach, describe, expect, it } from 'vitest';
import { userConfigStore, wordStore } from '../../store';
import { initialWordState, resetStores } from '../../test/utils';
import { calculateStats } from './calculate';
import { setKeystrokeClock } from './clock';
import { MAX_EXTRA_LETTERS, type Keystroke } from './types';
import {
   appendKeystroke,
   buildFinishedResult,
   classifyTypedKey,
   describeKeystrokeLog,
   syncKeystrokeStats,
   testDuration,
} from './record';

function stroke(
   key: string,
   expected: string | null,
   timestampMs: number,
   wordIndex = 0,
   kind?: Keystroke['kind']
): Keystroke {
   return {
      key,
      expected,
      kind:
         kind ??
         (expected === null
            ? 'extra'
            : key === expected
            ? 'correct'
            : 'incorrect'),
      timestampMs,
      wordIndex,
   };
}

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

describe('describeKeystrokeLog', () => {
   it('should count zero words on an empty log', () => {
      const described = describeKeystrokeLog([], ['ab', 'cd'], 15);

      expect(described.wordCount).toBe(0);
      expect(described.words).toEqual(['ab']);
      expect(described.stats).toEqual(
         calculateStats({ log: [], words: ['ab'], durationMs: 15_000 })
      );
   });

   it('should count the in-progress word without advancing past it', () => {
      const log = [stroke('a', 'a', 0)];
      const described = describeKeystrokeLog(log, ['ab', 'cd'], 15);

      expect(described.wordCount).toBe(1);
      expect(described.words).toEqual(['ab']);
      expect(described.stats.correct).toBe(1);
   });

   it('should not count the next word until a letter is typed after space', () => {
      const log = [
         stroke('a', 'a', 0),
         stroke('b', 'b', 20),
         stroke(' ', ' ', 40),
      ];
      const described = describeKeystrokeLog(log, ['ab', 'cd'], 15);

      expect(described.wordCount).toBe(1);
      expect(described.words).toEqual(['ab', 'cd']);
   });

   it('should score against the provided duration, not the keystroke span', () => {
      const log = [stroke('a', 'a', 0), stroke('b', 'b', 200)];
      const described = describeKeystrokeLog(log, ['ab'], 30);

      expect(described.stats).toEqual(
         calculateStats({ log, words: ['ab'], durationMs: 30_000 })
      );
      expect(described.stats.rawWpm).toBeCloseTo(0.8);
   });
});

describe('syncKeystrokeStats', () => {
   beforeEach(() => {
      resetStores();
   });

   it('should write live errorCount and typedEntries from a 1s placeholder duration', () => {
      const log = [
         stroke('a', 'a', 0),
         stroke('x', 'b', 100),
         stroke('z', null, 200),
      ];
      wordStore.setState({
         ...initialWordState,
         wordList: ['ab', 'cd'],
         keystrokeLog: log,
      });

      syncKeystrokeStats();

      const stats = calculateStats({
         log,
         words: ['ab', 'cd'],
         durationMs: 1000,
      });
      expect(wordStore.getState().errorCount).toBe(stats.errors);
      expect(wordStore.getState().typedEntries).toBe(stats.typedEntries);
      expect(wordStore.getState().errorCount).toBeGreaterThan(0);
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
