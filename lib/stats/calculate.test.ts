import { describe, expect, it } from 'vitest';
import { accurateWPM, calculateAccuracy, grossWPM } from '../utils';
import { garble, scoreTypedRun } from '../../test/scoring';
import { calculateStats, replayKeystrokeLog } from './calculate';
import { MAX_EXTRA_LETTERS, compactLog, expandLog } from './types';
import type { Keystroke, KeystrokeKind } from './types';

function stroke(
   key: string,
   expected: string | null,
   kind: KeystrokeKind,
   timestampMs: number,
   wordIndex: number
): Keystroke {
   return { key, expected, kind, timestampMs, wordIndex };
}

function typeWord(
   target: string,
   typed: string,
   wordIndex: number,
   startMs: number,
   step = 100
): Keystroke[] {
   const events: Keystroke[] = [];
   for (let index = 0; index < typed.length; index += 1) {
      const key = typed[index] ?? '';
      const expected = target[index] ?? null;
      const kind: KeystrokeKind =
         expected === null
            ? 'extra'
            : key === expected
            ? 'correct'
            : 'incorrect';
      events.push(
         stroke(key, expected, kind, startMs + index * step, wordIndex)
      );
   }
   return events;
}

function space(wordIndex: number, timestampMs: number): Keystroke {
   return stroke(' ', ' ', 'correct', timestampMs, wordIndex);
}

function pacedLog(
   word: string,
   wordCount: number,
   gapsMs: readonly number[]
): { log: Keystroke[]; words: string[] } {
   const words = Array.from({ length: wordCount }, () => word);
   const log: Keystroke[] = [];
   let timestampMs = 0;
   let gapIndex = 0;
   const advance = () => {
      const gap =
         gapsMs.length === 0 ? 0 : gapsMs[gapIndex % gapsMs.length] ?? 0;
      gapIndex += 1;
      timestampMs += gap;
   };

   words.forEach((target, wordIndex) => {
      for (const key of target) {
         log.push(stroke(key, key, 'correct', timestampMs, wordIndex));
         advance();
      }
      log.push(space(wordIndex, timestampMs));
      advance();
   });

   return { log, words };
}

function logFromTypedWords(
   words: readonly string[],
   typedWords: readonly string[],
   closeLastWord: boolean
): Keystroke[] {
   const log: Keystroke[] = [];
   let timestampMs = 0;

   typedWords.forEach((typed, wordIndex) => {
      const target = words[wordIndex] ?? '';
      const letters = typeWord(target, typed, wordIndex, timestampMs, 10);
      log.push(...letters);
      timestampMs += typed.length * 10;
      const isLast = wordIndex === typedWords.length - 1;
      if (!isLast || closeLastWord) {
         log.push(space(wordIndex, timestampMs));
         timestampMs += 10;
      }
   });

   return log;
}

describe('calculateStats', () => {
   it('should report a clean empty test when nothing was typed', () => {
      const stats = calculateStats({
         log: [],
         words: ['abcde'],
         durationMs: 15_000,
      });

      expect(stats.typedEntries).toBe(0);
      expect(stats.errors).toBe(0);
      expect(stats.wpm).toBe(0);
      expect(stats.rawWpm).toBe(0);
      expect(stats.accuracy).toBe(100);
      expect(stats.consistency).toBe(100);
      expect(stats.samples).toHaveLength(15);
      expect(stats.perKey).toEqual([]);
   });

   it('should return zero speeds when the duration is not positive', () => {
      const log = typeWord('ab', 'ab', 0, 0);
      const stats = calculateStats({ log, words: ['ab'], durationMs: 0 });

      expect(stats.typedEntries).toBe(2);
      expect(stats.accuracy).toBe(100);
      expect(stats.wpm).toBe(0);
      expect(stats.rawWpm).toBe(0);
      expect(stats.samples).toEqual([]);
   });

   it.each([Number.NaN, Number.POSITIVE_INFINITY, -1000])(
      'should treat non-finite durationMs %s as a zero-length test',
      (durationMs) => {
         const log = typeWord('ab', 'ab', 0, 0);
         const stats = calculateStats({ log, words: ['ab'], durationMs });

         expect(stats.typedEntries).toBe(2);
         expect(stats.errors).toBe(0);
         expect(stats.wpm).toBe(0);
         expect(stats.rawWpm).toBe(0);
         expect(stats.samples).toEqual([]);
         expect(stats.consistency).toBe(100);
      }
   );

   it('should ignore letters that have not been typed on the active word', () => {
      const stats = calculateStats({
         log: typeWord('abcde', 'ab', 0, 0),
         words: ['abcde'],
         durationMs: 15_000,
      });

      expect(stats.errors).toBe(0);
      expect(stats.missed).toBe(0);
      expect(stats.typedEntries).toBe(2);
      expect(stats.accuracy).toBe(100);
   });

   it('should count untyped letters once a word is submitted', () => {
      const log = [...typeWord('abcde', 'ab', 0, 0), space(0, 250)];
      const stats = calculateStats({
         log,
         words: ['abcde', 'fghij'],
         durationMs: 15_000,
      });

      expect(stats.missed).toBe(3);
      expect(stats.errors).toBe(3);
      expect(stats.typedEntries).toBe(3);
      expect(stats.accuracy).toBe(0);
      expect(stats.perKey.find((item) => item.key === 'c')?.incorrect).toBe(1);
   });

   it('should keep a finished mistake after the next word starts', () => {
      const log = [
         ...typeWord('abcde', 'abxde', 0, 0),
         space(0, 500),
         ...typeWord('fghij', 'fghij', 1, 600),
      ];
      const stats = calculateStats({
         log,
         words: ['abcde', 'fghij'],
         durationMs: 15_000,
      });

      expect(stats.incorrect).toBe(1);
      expect(stats.errors).toBe(1);
      expect(stats.typedEntries).toBe(11);
      expect(stats.accuracy).toBeCloseTo(calculateAccuracy(1, 11), 5);
      expect(stats.wpm).toBeCloseTo(accurateWPM(1, 11, 15), 5);
      expect(stats.rawWpm).toBeCloseTo(grossWPM(11, 15), 5);
      expect(stats.wpm).toBeLessThan(stats.rawWpm);
   });

   it('should reproduce the scored run when every fourth word is mistyped', () => {
      const words = Array.from({ length: 49 }, () => 'abcde');
      const typedWords = words.map((word, index) =>
         (index + 1) % 4 === 0 ? garble(word) : word
      );
      const log = logFromTypedWords(words, typedWords, false);
      const expected = scoreTypedRun({
         words,
         completed: typedWords.slice(0, -1),
         current: typedWords[typedWords.length - 1] ?? '',
      });
      const stats = calculateStats({
         log,
         words,
         durationMs: 15_000,
      });
      const replayed = calculateStats({
         log: expandLog(compactLog(log)),
         words,
         durationMs: 15_000,
      });

      expect(expected.errors).toBeGreaterThan(0);
      expect(stats.typedEntries).toBe(expected.typedEntries);
      expect(stats.errors).toBe(expected.errors);
      expect(stats.wpm).toBeCloseTo(
         accurateWPM(expected.errors, expected.typedEntries, 15),
         5
      );
      expect(stats.accuracy).toBeCloseTo(
         calculateAccuracy(expected.errors, expected.typedEntries),
         5
      );
      expect(stats.wpm).toBeLessThan(stats.rawWpm);
      expect(replayed).toEqual(stats);
   });

   it('should replay the same log to the same wpm and accuracy', () => {
      const log = [
         ...typeWord('abcde', 'abcde', 0, 0, 80),
         space(0, 400),
         ...typeWord('fghij', 'fgehj', 1, 500, 80),
      ];
      const first = calculateStats({
         log,
         words: ['abcde', 'fghij'],
         durationMs: 30_000,
      });
      const second = calculateStats({
         log,
         words: ['abcde', 'fghij'],
         durationMs: 30_000,
      });

      expect(second).toEqual(first);
      expect(replayKeystrokeLog(log, ['abcde', 'fghij'])).toEqual({
         typedWords: ['abcde', 'fgehj'],
         activeIndex: 1,
      });
   });

   it('should ignore a tampered kind and score the characters that remain', () => {
      const log = typeWord('abcde', 'abxde', 0, 0).map((entry) =>
         entry.key === 'x' ? { ...entry, kind: 'correct' as const } : entry
      );
      const stats = calculateStats({
         log,
         words: ['abcde'],
         durationMs: 15_000,
      });

      expect(stats.incorrect).toBe(1);
      expect(stats.accuracy).toBeCloseTo(calculateAccuracy(1, 5), 5);
   });

   it('should drop a corrected mistake from the final accuracy', () => {
      const log = [
         ...typeWord('abcde', 'abx', 0, 0),
         stroke('Backspace', 'c', 'backspace', 300, 0),
         ...typeWord('cde', 'cde', 0, 400),
      ];
      const stats = calculateStats({
         log,
         words: ['abcde'],
         durationMs: 15_000,
      });

      expect(replayKeystrokeLog(log, ['abcde']).typedWords[0]).toBe('abcde');
      expect(stats.errors).toBe(0);
      expect(stats.typedEntries).toBe(5);
      expect(stats.accuracy).toBe(100);
      expect(stats.perKey.every((item) => item.incorrect === 0)).toBe(true);
   });

   it('should undo the previous word when backspace crosses a space', () => {
      const log = [
         ...typeWord('cat', 'cat', 0, 0),
         space(0, 300),
         stroke('Backspace', ' ', 'backspace', 400, 1),
         stroke('Backspace', 't', 'backspace', 500, 0),
         stroke('s', 't', 'incorrect', 600, 0),
      ];
      const replayed = replayKeystrokeLog(log, ['cat', 'dog']);
      const stats = calculateStats({
         log,
         words: ['cat', 'dog'],
         durationMs: 15_000,
      });

      expect(replayed.activeIndex).toBe(0);
      expect(replayed.typedWords[0]).toBe('cas');
      expect(stats.typedEntries).toBe(3);
      expect(stats.errors).toBe(1);
   });

   it('should cap extra letters at ten per word', () => {
      const extras = 'x'.repeat(MAX_EXTRA_LETTERS + 5);
      const log = typeWord('ab', `ab${extras}`, 0, 0, 20);
      const stats = calculateStats({
         log,
         words: ['ab'],
         durationMs: 15_000,
      });

      expect(log).toHaveLength(2 + extras.length);
      expect(stats.extra).toBe(MAX_EXTRA_LETTERS);
      expect(stats.typedEntries).toBe(2 + MAX_EXTRA_LETTERS);
      expect(stats.errors).toBe(MAX_EXTRA_LETTERS);
      expect(replayKeystrokeLog(log, ['ab']).typedWords[0]).toBe(
         `ab${'x'.repeat(MAX_EXTRA_LETTERS)}`
      );
   });

   it('should count a space toward raw speed and place it in its second', () => {
      const log = [...typeWord('abcde', 'abcde', 0, 100), space(0, 1_500)];
      const stats = calculateStats({
         log,
         words: ['abcde'],
         durationMs: 3_000,
      });
      const characterTotal = stats.samples.reduce(
         (sum, sample) => sum + sample.characters,
         0
      );

      expect(stats.typedEntries).toBe(6);
      expect(characterTotal).toBe(stats.typedEntries);
      expect(stats.samples[0]?.characters).toBe(5);
      expect(stats.samples[1]?.characters).toBe(1);
      expect(stats.samples[2]?.characters).toBe(0);
      expect(stats.rawWpm).toBeCloseTo(
         stats.samples.reduce((sum, sample) => sum + sample.rawWpm, 0) /
            stats.samples.length,
         5
      );
   });

   it('should fold a timestamp past the end into the last second', () => {
      const stats = calculateStats({
         log: typeWord('ab', 'ab', 0, 9_500),
         words: ['ab'],
         durationMs: 2_000,
      });

      expect(stats.samples).toHaveLength(2);
      expect(stats.samples[1]?.characters).toBe(2);
      expect(stats.samples[0]?.characters).toBe(0);
   });

   it('should treat negative timestamps as the start of the test', () => {
      const stats = calculateStats({
         log: [stroke('a', 'a', 'correct', -40, 0)],
         words: ['a'],
         durationMs: 2_000,
      });

      expect(stats.samples[0]?.characters).toBe(1);
      expect(stats.typedEntries).toBe(1);
   });

   it('should be perfectly consistent when every second has the same raw speed', () => {
      const log: Keystroke[] = [];
      for (let second = 0; second < 4; second += 1) {
         log.push(
            ...typeWord('abcde', 'abcde', second, second * 1000, 100),
            space(second, second * 1000 + 600)
         );
      }
      const words = Array.from({ length: 4 }, () => 'abcde');
      const stats = calculateStats({ log, words, durationMs: 4_000 });

      expect(stats.samples.map((sample) => sample.rawWpm)).toEqual([
         72, 72, 72, 72,
      ]);
      expect(stats.consistency).toBe(100);
   });

   it('should ignore an empty second after the last keystroke', () => {
      const stats = calculateStats({
         log: typeWord('abcdeabcde', 'abcdeabcde', 0, 0, 10),
         words: ['abcdeabcde'],
         durationMs: 2_000,
      });

      expect(stats.samples[0]?.rawWpm).toBe(120);
      expect(stats.samples[1]?.rawWpm).toBe(0);
      expect(stats.consistency).toBe(100);
   });

   it('should score a one second test as fully consistent', () => {
      const stats = calculateStats({
         log: typeWord('abcde', 'abcde', 0, 120, 140),
         words: ['abcde'],
         durationMs: 1_000,
      });

      expect(stats.samples).toHaveLength(1);
      expect(stats.samples[0]?.characters).toBe(5);
      expect(stats.consistency).toBe(100);
   });

   it('should stay consistent when a steady human pace does not fill the clock', () => {
      const { log, words } = pacedLog(
         'abcde',
         14,
         [150, 165, 140, 180, 155, 170, 145, 175, 160, 185]
      );
      const stats = calculateStats({ log, words, durationMs: 30_000 });

      expect(stats.samples).toHaveLength(30);
      expect(stats.samples.at(-1)?.rawWpm).toBe(0);
      expect(stats.typedEntries).toBe(log.length);
      expect(stats.consistency).toBeGreaterThanOrEqual(80);
      expect(stats.consistency).toBeLessThanOrEqual(95);
   });

   it('should score erratic human intervals below a steady pace', () => {
      const steady = calculateStats({
         ...pacedLog(
            'abcde',
            14,
            [150, 165, 140, 180, 155, 170, 145, 175, 160, 185]
         ),
         durationMs: 30_000,
      });
      const erratic = calculateStats({
         ...pacedLog(
            'abcde',
            16,
            [40, 45, 50, 40, 55, 820, 40, 45, 900, 50, 40, 760, 35, 480, 1100]
         ),
         durationMs: 30_000,
      });

      expect(erratic.consistency).toBeGreaterThan(30);
      expect(erratic.consistency).toBeLessThan(70);
      expect(erratic.consistency).toBeLessThan(steady.consistency - 20);
   });

   it('should map a two speed test through kogasa', () => {
      const target = 'abcdefghijk';
      const log = [
         ...target
            .slice(0, 10)
            .split('')
            .map((key, index) => stroke(key, key, 'correct', index * 40, 0)),
         stroke(target[10] ?? '', target[10] ?? '', 'correct', 1_400, 0),
      ];
      const stats = calculateStats({
         log,
         words: [target],
         durationMs: 2_000,
      });

      expect(stats.samples.map((sample) => sample.rawWpm)).toEqual([120, 12]);
      expect(stats.consistency).toBeCloseTo(20.9006, 3);
   });

   it('should count a pause between keystrokes as inconsistent', () => {
      const target = 'abcdefghijklmnop';
      const log = target
         .split('')
         .map((key, index) =>
            stroke(
               key,
               key,
               'correct',
               index < 8 ? 50 + index * 80 : 2_100 + (index - 8) * 80,
               0
            )
         );
      const stats = calculateStats({
         log,
         words: [target],
         durationMs: 4_000,
      });

      expect(stats.samples.map((sample) => sample.rawWpm)).toEqual([
         96, 0, 96, 0,
      ]);
      expect(stats.consistency).toBeCloseTo(30.3581, 3);
   });

   it('should attribute missed letters to the second the word was submitted', () => {
      const log = [...typeWord('abcde', 'ab', 0, 100), space(0, 1_200)];
      const stats = calculateStats({
         log,
         words: ['abcde'],
         durationMs: 2_000,
      });
      const errorTotal = stats.samples.reduce(
         (sum, sample) => sum + sample.errors,
         0
      );

      expect(stats.samples[0]?.errors).toBe(0);
      expect(stats.samples[1]?.errors).toBe(3);
      expect(errorTotal).toBe(stats.errors);
   });

   it('should report net wpm below raw wpm when a second has incorrect letters', () => {
      const stats = calculateStats({
         log: typeWord('ab', 'ax', 0, 0),
         words: ['ab'],
         durationMs: 1_000,
      });
      const sample = stats.samples[0];

      expect(sample?.characters).toBe(2);
      expect(sample?.errors).toBe(1);
      expect(sample?.rawWpm).toBe(24);
      expect(sample?.wpm).toBe(12);
      expect(sample?.accuracy).toBe(50);
      expect(sample?.rawWpm).toBeGreaterThan(sample?.wpm ?? 0);
   });

   it('should zero net wpm when missed letters land on the submit second', () => {
      const log = [...typeWord('abcde', 'ab', 0, 100), space(0, 1_200)];
      const stats = calculateStats({
         log,
         words: ['abcde', 'fghij'],
         durationMs: 2_000,
      });
      const submitSecond = stats.samples[1];

      expect(submitSecond?.characters).toBe(1);
      expect(submitSecond?.errors).toBe(3);
      expect(submitSecond?.rawWpm).toBe(12);
      expect(submitSecond?.wpm).toBe(0);
      expect(submitSecond?.accuracy).toBe(0);
   });

   it('should build per-key stats from the final characters', () => {
      const stats = calculateStats({
         log: typeWord('ab', 'axyy', 0, 0),
         words: ['ab'],
         durationMs: 10_000,
      });

      expect(stats.perKey).toEqual([
         {
            key: 'a',
            correct: 1,
            incorrect: 0,
            extra: 0,
            accuracy: 100,
         },
         {
            key: 'b',
            correct: 0,
            incorrect: 1,
            extra: 0,
            accuracy: 0,
         },
         {
            key: 'y',
            correct: 0,
            incorrect: 0,
            extra: 2,
            accuracy: 0,
         },
      ]);
   });

   it('should no-op a leading backspace', () => {
      const log = [stroke('Backspace', null, 'backspace', 0, 0)];
      const stats = calculateStats({
         log,
         words: ['abcde'],
         durationMs: 15_000,
      });

      expect(stats.typedEntries).toBe(0);
      expect(stats.errors).toBe(0);
      expect(replayKeystrokeLog(log, ['abcde'])).toEqual({
         typedWords: [''],
         activeIndex: 0,
      });
   });

   it('should ignore a lying wordIndex and type into the sequential active word', () => {
      const log = typeWord('ab', 'ab', 3, 0);
      const replayed = replayKeystrokeLog(log, ['ab']);
      const stats = calculateStats({
         log,
         words: ['ab'],
         durationMs: 1_000,
      });

      expect(replayed).toEqual({ typedWords: ['ab'], activeIndex: 0 });
      expect(stats.typedEntries).toBe(2);
      expect(stats.errors).toBe(0);
      expect(stats.wpm).toBeGreaterThan(0);
   });

   it('should not rewrite a submitted word when later strokes reuse wordIndex 0', () => {
      const log = [
         ...typeWord('ab', 'ab', 0, 0),
         space(0, 20),
         ...typeWord('cd', 'xy', 0, 30),
      ];
      const replayed = replayKeystrokeLog(log, ['ab', 'cd']);
      const stats = calculateStats({
         log,
         words: ['ab', 'cd'],
         durationMs: 1_000,
      });

      expect(replayed.typedWords).toEqual(['ab', 'xy']);
      expect(replayed.activeIndex).toBe(1);
      expect(stats.correct).toBe(2);
      expect(stats.incorrect).toBe(2);
   });
});
