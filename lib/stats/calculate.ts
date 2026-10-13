import type { Keystroke, PerKeyStat, SecondSample, TestStats } from './types';
import { MAX_EXTRA_LETTERS } from './types';

export interface CalculateStatsInput {
   log: readonly Keystroke[];
   words: readonly string[];
   durationMs: number;
}

export interface ReplayedLog {
   typedWords: string[];
   activeIndex: number;
}

interface LiveChar {
   key: string;
   timestampMs: number;
   role: 'letter' | 'space';
   correct: boolean;
   expected: string | null;
}

interface ReplayWord {
   typed: string;
   live: LiveChar[];
}

interface Replay {
   words: ReplayWord[];
   activeIndex: number;
}

interface KeyTally {
   correct: number;
   incorrect: number;
   extra: number;
}

function clamp(value: number, min: number, max: number): number {
   return Math.min(max, Math.max(min, value));
}

function finiteDuration(durationMs: number): number {
   if (!Number.isFinite(durationMs) || durationMs <= 0) return 0;
   return durationMs;
}

function timestampOf(value: number): number {
   if (!Number.isFinite(value) || value <= 0) return 0;
   return value;
}

function emptyWord(): ReplayWord {
   return { typed: '', live: [] };
}

function ensureWord(replay: Replay, index: number): ReplayWord {
   while (replay.words.length <= index) {
      replay.words.push(emptyWord());
   }
   return replay.words[index] ?? emptyWord();
}

function insertChar(
   replay: Replay,
   event: Keystroke,
   words: readonly string[]
): void {
   const word = ensureWord(replay, replay.activeIndex);
   const target = words[replay.activeIndex] ?? '';
   const position = word.typed.length;
   const isExtra = position >= target.length;
   if (isExtra && position - target.length >= MAX_EXTRA_LETTERS) return;

   const expected = isExtra ? null : target[position] ?? null;
   const key = event.key;
   word.typed += key;
   word.live.push({
      key,
      timestampMs: timestampOf(event.timestampMs),
      role: 'letter',
      correct: expected !== null && key === expected,
      expected,
   });
}

function commitWord(replay: Replay, event: Keystroke): void {
   const word = ensureWord(replay, replay.activeIndex);
   word.live.push({
      key: ' ',
      timestampMs: timestampOf(event.timestampMs),
      role: 'space',
      correct: true,
      expected: ' ',
   });
   replay.activeIndex += 1;
   ensureWord(replay, replay.activeIndex);
}

function eraseChar(replay: Replay): void {
   const word = ensureWord(replay, replay.activeIndex);
   if (word.typed.length === 0) {
      if (replay.activeIndex === 0) return;
      replay.activeIndex -= 1;
      const previous = ensureWord(replay, replay.activeIndex);
      const last = previous.live[previous.live.length - 1];
      if (last?.role === 'space') previous.live.pop();
      return;
   }

   word.typed = word.typed.slice(0, -1);
   const last = word.live[word.live.length - 1];
   if (last?.role === 'letter') word.live.pop();
}

function replay(log: readonly Keystroke[], words: readonly string[]): Replay {
   const state: Replay = { words: [emptyWord()], activeIndex: 0 };

   for (const event of log) {
      switch (event.kind) {
         case 'backspace':
            eraseChar(state);
            break;
         case 'correct':
         case 'incorrect':
         case 'extra':
            if (event.key === ' ') commitWord(state, event);
            else insertChar(state, event, words);
            break;
         default: {
            const unreachable: never = event.kind;
            throw new Error(`Unknown keystroke kind: ${String(unreachable)}`);
         }
      }
   }

   return state;
}

function bump(
   tally: Map<string, KeyTally>,
   key: string,
   field: keyof KeyTally
) {
   if (!key) return;
   const current = tally.get(key) ?? { correct: 0, incorrect: 0, extra: 0 };
   current[field] += 1;
   tally.set(key, current);
}

function perKeyStats(tally: Map<string, KeyTally>): PerKeyStat[] {
   return [...tally.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, counts]) => {
         const attempts = counts.correct + counts.incorrect + counts.extra;
         const accuracy =
            attempts === 0 ? 100 : (counts.correct / attempts) * 100;
         return {
            key,
            correct: counts.correct,
            incorrect: counts.incorrect,
            extra: counts.extra,
            accuracy,
         };
      });
}

function wpmFromChars(characters: number, durationMs: number): number {
   if (durationMs <= 0) return 0;
   const minutes = durationMs / 60_000;
   return characters / 5 / minutes;
}

function consistencyOf(rawSamples: readonly number[]): number {
   if (rawSamples.length === 0) return 100;
   const mean =
      rawSamples.reduce((sum, value) => sum + value, 0) / rawSamples.length;
   if (mean === 0) return 100;
   const variance =
      rawSamples.reduce((sum, value) => sum + (value - mean) ** 2, 0) /
      rawSamples.length;
   const deviation = Math.sqrt(variance);
   return clamp(100 - (deviation / mean) * 100, 0, 100);
}

function secondIndex(timestampMs: number, seconds: number): number {
   if (seconds <= 0) return -1;
   return clamp(Math.floor(timestampMs / 1000), 0, seconds - 1);
}

export function replayKeystrokeLog(
   log: readonly Keystroke[],
   words: readonly string[]
): ReplayedLog {
   const replayed = replay(log, words);
   return {
      typedWords: replayed.words.map((word) => word.typed),
      activeIndex: replayed.activeIndex,
   };
}

export function calculateStats(input: CalculateStatsInput): TestStats {
   const durationMs = finiteDuration(input.durationMs);
   const replayed = replay(input.log, input.words);
   const tally = new Map<string, KeyTally>();
   let correct = 0;
   let incorrect = 0;
   let extra = 0;
   let missed = 0;
   let typedEntries = 0;

   const seconds = durationMs === 0 ? 0 : Math.ceil(durationMs / 1000);
   const buckets = Array.from({ length: seconds }, () => ({
      characters: 0,
      errors: 0,
   }));

   const addBucket = (
      timestampMs: number,
      characters: number,
      errors: number
   ) => {
      const index = secondIndex(timestampMs, seconds);
      const bucket = index < 0 ? undefined : buckets[index];
      if (!bucket) return;
      bucket.characters += characters;
      bucket.errors += errors;
   };

   for (
      let index = 0;
      index <= replayed.activeIndex && index < replayed.words.length;
      index += 1
   ) {
      const word = replayed.words[index] ?? emptyWord();
      const target = input.words[index] ?? '';
      const countMissed = index < replayed.activeIndex;
      const shared = Math.min(target.length, word.typed.length);

      typedEntries += word.live.length;

      for (let charIndex = 0; charIndex < shared; charIndex += 1) {
         const expected = target[charIndex] ?? '';
         if (word.typed[charIndex] === expected) {
            correct += 1;
            bump(tally, expected, 'correct');
         } else {
            incorrect += 1;
            bump(tally, expected, 'incorrect');
         }
      }

      if (word.typed.length > target.length) {
         extra += word.typed.length - target.length;
         for (
            let charIndex = target.length;
            charIndex < word.typed.length;
            charIndex += 1
         ) {
            bump(tally, word.typed[charIndex] ?? '', 'extra');
         }
      } else if (countMissed && word.typed.length < target.length) {
         const missedCount = target.length - word.typed.length;
         missed += missedCount;
         for (
            let charIndex = word.typed.length;
            charIndex < target.length;
            charIndex += 1
         ) {
            bump(tally, target[charIndex] ?? '', 'incorrect');
         }
      }

      for (const live of word.live) {
         const letterError = live.role === 'letter' && !live.correct ? 1 : 0;
         addBucket(live.timestampMs, 1, letterError);
      }

      if (countMissed && target.length > word.typed.length) {
         const space = [...word.live]
            .reverse()
            .find((live) => live.role === 'space');
         const missedAt =
            space?.timestampMs ??
            word.live[word.live.length - 1]?.timestampMs ??
            0;
         addBucket(missedAt, 0, target.length - word.typed.length);
      }
   }

   const errors = incorrect + extra + missed;
   const samples: SecondSample[] = buckets.map((bucket, second) => {
      const net = Math.max(bucket.characters - bucket.errors, 0);
      const accuracy =
         bucket.characters === 0
            ? 100
            : clamp(
                 ((bucket.characters - bucket.errors) / bucket.characters) *
                    100,
                 0,
                 100
              );
      return {
         second,
         characters: bucket.characters,
         errors: bucket.errors,
         rawWpm: (bucket.characters / 5) * 60,
         wpm: (net / 5) * 60,
         accuracy,
      };
   });

   const accuracy =
      typedEntries === 0
         ? 100
         : clamp(((typedEntries - errors) / typedEntries) * 100, 0, 100);

   return {
      wpm: wpmFromChars(Math.max(typedEntries - errors, 0), durationMs),
      rawWpm: wpmFromChars(typedEntries, durationMs),
      accuracy,
      consistency: consistencyOf(samples.map((sample) => sample.rawWpm)),
      typedEntries,
      errors,
      correct,
      incorrect,
      extra,
      missed,
      samples,
      perKey: perKeyStats(tally),
   };
}
