import { beforeEach, describe, expect, it } from 'vitest';
import { userConfigStore, wordStore } from '../../store';
import { initialWordState, resetStores } from '../../test/utils';
import { calculateStats } from './calculate';
import { setKeystrokeClock } from './clock';
import { appendKeystroke, buildFinishedResult, testDuration } from './record';

describe('testDuration', () => {
   it('should use the configured limit for a timed test', () => {
      expect(testDuration([], 'time', 15)).toEqual({
         durationMs: 15_000,
         durationSeconds: 15,
      });
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
