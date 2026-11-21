import { beforeEach, describe, expect, it } from 'vitest';
import { userConfigStore, wordStore } from '../../store';
import { initialWordState, resetStores } from '../../test/utils';
import { summarizeResults } from './aggregate';
import { calculateStats } from './calculate';
import { buildWpmChart } from './chart';
import { buildFinishedResult, testDuration } from './record';
import type { Keystroke, KeystrokeKind } from './types';

const gapMs = 100;
const words = Array.from({ length: 10 }, () => 'type');

function stroke(
   key: string,
   expected: string | null,
   kind: KeystrokeKind,
   timestampMs: number,
   wordIndex: number
): Keystroke {
   return { key, expected, kind, timestampMs, wordIndex };
}

function cleanWordsLog(
   targets: readonly string[],
   gap: number,
   trailingSpace: boolean
): Keystroke[] {
   const log: Keystroke[] = [];
   let timestampMs = 0;

   targets.forEach((word, wordIndex) => {
      for (const key of word) {
         log.push(stroke(key, key, 'correct', timestampMs, wordIndex));
         timestampMs += gap;
      }
      const last = wordIndex === targets.length - 1;
      if (!last || trailingSpace) {
         log.push(stroke(' ', ' ', 'correct', timestampMs, wordIndex));
         timestampMs += gap;
      }
   });

   return log;
}

function finish(
   log: Keystroke[],
   targets: readonly string[],
   category: string
) {
   wordStore.setState({
      ...initialWordState,
      wordList: [...targets],
      activeWord: targets[0] ?? '',
      keystrokeLog: log,
   });
   userConfigStore.setState({
      category,
      wordCount: targets.length,
      time: 15,
   });
   return buildFinishedResult();
}

describe('words mode wpm', () => {
   beforeEach(() => {
      resetStores();
   });

   it('should equal correct chars / 5 / minutes for a 10 word run', () => {
      const log = cleanWordsLog(words, gapMs, false);
      const correctChars = log.length;
      const elapsedMs = correctChars * gapMs;
      const minutes = elapsedMs / 60_000;
      const bumpedMs = (correctChars - 1) * gapMs;

      expect(log).toHaveLength(49);
      expect(testDuration(log, 'words', 15)).toEqual({
         durationMs: elapsedMs,
         durationSeconds: elapsedMs / 1000,
      });

      const stats = calculateStats({
         log,
         words,
         durationMs: elapsedMs,
      });
      const result = finish(log, words, 'words');

      expect(stats.correct).toBe(40);
      expect(stats.errors).toBe(0);
      expect(stats.typedEntries).toBe(correctChars);
      expect(stats.wpm).toBe(correctChars / 5 / minutes);
      expect(stats.rawWpm).toBe(stats.wpm);
      expect(stats.wpm).toBeCloseTo(120, 8);
      expect(stats.samples).toHaveLength(Math.ceil(elapsedMs / 1000));
      expect(correctChars / 5 / (bumpedMs / 60_000) / stats.wpm).toBeCloseTo(
         correctChars / (correctChars - 1),
         8
      );
      expect(result?.durationSeconds).toBe(elapsedMs / 1000);
      expect(result?.stats.wpm).toBe(stats.wpm);
      expect(result?.wordCount).toBe(10);

      const summary = summarizeResults(result ? [result] : []);
      expect(summary.personalBests.wpm).toBe(stats.wpm);
      expect(summary.recent[0]?.wpm).toBe(stats.wpm);

      const chart = buildWpmChart(stats.samples, elapsedMs / 1000);
      expect(chart.points).toHaveLength(stats.samples.length);
      expect(chart.points.map((point) => point.wpm)).toEqual(
         stats.samples.map((sample) => sample.wpm)
      );
   });

   it('should keep a timed run on the configured 15 second wpm', () => {
      const log = cleanWordsLog(words, gapMs, false);
      const timed = calculateStats({
         log,
         words,
         durationMs: 15_000,
      });

      expect(testDuration(log, 'time', 15)).toEqual({
         durationMs: 15_000,
         durationSeconds: 15,
      });
      expect(timed.wpm).toBe(39.2);
      expect(timed.rawWpm).toBe(39.2);
      expect(timed.typedEntries).toBe(49);
      expect(timed.wpm).toBe(49 / 5 / (15 / 60));

      const result = finish(log, words, 'time');
      expect(result?.durationSeconds).toBe(15);
      expect(result?.stats).toEqual(timed);
      expect(result?.stats.wpm).toBe(39.2);
   });
});

describe('words mode wpm edges', () => {
   const cat = ['cat'];

   it('should stay finite when every keystroke is at the origin', () => {
      const log = [
         stroke('c', 'c', 'correct', 0, 0),
         stroke('a', 'a', 'correct', 0, 0),
         stroke('t', 't', 'correct', 0, 0),
      ];
      const duration = testDuration(log, 'words', 15);
      const stats = calculateStats({
         log,
         words: cat,
         durationMs: duration.durationMs,
      });

      expect(duration).toEqual({ durationMs: 1, durationSeconds: 0.001 });
      expect(stats.wpm).toBe(3 / 5 / (1 / 60_000));
      expect(Number.isFinite(stats.wpm)).toBe(true);
   });

   it('should count a 1ms gap as two character intervals', () => {
      const log = [
         stroke('a', 'a', 'correct', 0, 0),
         stroke('b', 'b', 'correct', 1, 0),
      ];
      const duration = testDuration(log, 'words', 15);
      const stats = calculateStats({
         log,
         words: ['ab'],
         durationMs: duration.durationMs,
      });

      expect(duration.durationMs).toBe(2);
      expect(stats.wpm).toBe(2 / 5 / (2 / 60_000));
   });

   it('should give an all-wrong word no credit and still count a space that was typed', () => {
      const targets = ['cat', 'dog'];
      const log = [
         ...['x', 'y', 'z'].map((key, index) =>
            stroke(key, 'cat'[index] ?? null, 'incorrect', index * gapMs, 0)
         ),
         stroke(' ', ' ', 'correct', 3 * gapMs, 0),
         ...['x', 'y', 'z'].map((key, index) =>
            stroke(
               key,
               'dog'[index] ?? null,
               'incorrect',
               (4 + index) * gapMs,
               1
            )
         ),
      ];
      const duration = testDuration(log, 'words', 15);
      const stats = calculateStats({
         log,
         words: targets,
         durationMs: duration.durationMs,
      });
      const minutes = duration.durationMs / 60_000;
      const net = stats.typedEntries - stats.errors;

      expect(stats.errors).toBe(6);
      expect(net).toBe(1);
      expect(stats.wpm).toBe(net / 5 / minutes);
      expect(stats.wpm).toBeGreaterThan(0);

      const lettersOnly = ['x', 'y', 'z'].map((key, index) =>
         stroke(key, 'cat'[index] ?? null, 'incorrect', index * gapMs, 0)
      );
      const bare = testDuration(lettersOnly, 'words', 15);
      const bareStats = calculateStats({
         log: lettersOnly,
         words: cat,
         durationMs: bare.durationMs,
      });
      expect(bareStats.errors).toBe(3);
      expect(bareStats.wpm).toBe(0);
   });

   it('should drop a corrected mistake and keep the time those keys took', () => {
      const log = [
         stroke('c', 'c', 'correct', 0, 0),
         stroke('a', 'a', 'correct', gapMs, 0),
         stroke('x', 't', 'incorrect', 2 * gapMs, 0),
         stroke('Backspace', 't', 'backspace', 3 * gapMs, 0),
         stroke('t', 't', 'correct', 4 * gapMs, 0),
      ];
      const duration = testDuration(log, 'words', 15);
      const stats = calculateStats({
         log,
         words: cat,
         durationMs: duration.durationMs,
      });
      const minutes = duration.durationMs / 60_000;

      expect(duration.durationMs).toBe(500);
      expect(stats.errors).toBe(0);
      expect(stats.typedEntries).toBe(3);
      expect(stats.wpm).toBe(3 / 5 / minutes);
   });

   it('should count a typed trailing space and not invent one when the last word has none', () => {
      const targets = ['ab', 'cd'];
      const clean = cleanWordsLog(targets, gapMs, false);
      const trailed = cleanWordsLog(targets, gapMs, true);
      const cleanDuration = testDuration(clean, 'words', 15);
      const trailedDuration = testDuration(trailed, 'words', 15);
      const cleanStats = calculateStats({
         log: clean,
         words: targets,
         durationMs: cleanDuration.durationMs,
      });
      const trailedStats = calculateStats({
         log: trailed,
         words: targets,
         durationMs: trailedDuration.durationMs,
      });

      expect(clean).toHaveLength(5);
      expect(cleanStats.typedEntries).toBe(5);
      expect(cleanStats.correct).toBe(4);
      expect(cleanStats.wpm).toBe(5 / 5 / (cleanDuration.durationMs / 60_000));
      expect(trailed).toHaveLength(6);
      expect(trailedStats.typedEntries).toBe(6);
      expect(trailedStats.wpm).toBe(
         6 / 5 / (trailedDuration.durationMs / 60_000)
      );
   });

   it('should give the results chart the second that the opening gap adds', () => {
      const log = [
         stroke('a', 'a', 'correct', 0, 0),
         stroke('b', 'b', 'correct', 1_000, 0),
      ];
      const duration = testDuration(log, 'words', 15);
      const stats = calculateStats({
         log,
         words: ['ab'],
         durationMs: duration.durationMs,
      });
      const chart = buildWpmChart(stats.samples, duration.durationSeconds);

      expect(duration.durationMs).toBe(2_000);
      expect(stats.samples).toHaveLength(2);
      expect(stats.samples[0]?.characters).toBe(1);
      expect(stats.samples[1]?.characters).toBe(1);
      expect(chart.points).toHaveLength(2);
   });

   it('should ignore keystroke timestamps when the category is time', () => {
      const log = [
         stroke('a', 'a', 'correct', 0, 0),
         stroke('b', 'b', 'correct', 14_900, 0),
      ];

      expect(testDuration(log, 'time', 15)).toEqual({
         durationMs: 15_000,
         durationSeconds: 15,
      });
      expect(testDuration(log, 'words', 15).durationMs).toBe(29_800);

      const timed = calculateStats({
         log,
         words: ['ab'],
         durationMs: 15_000,
      });
      expect(timed.wpm).toBe(2 / 5 / (15 / 60));
      expect(timed.wpm).not.toBe(
         2 / 5 / (testDuration(log, 'words', 15).durationMs / 60_000)
      );
   });
});
