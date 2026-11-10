import { userConfigStore, wordStore } from '../../store';
import { calculateStats, replayKeystrokeLog } from './calculate';
import { keystrokeTimestamp } from './clock';
import { compactLog, MAX_EXTRA_LETTERS } from './types';
import type {
   Keystroke,
   KeystrokeKind,
   SavedTestResult,
   TestStats,
} from './types';

export function classifyTypedKey(
   activeWord: string,
   typedSoFar: string,
   key: string
): {
   expected: string | null;
   kind: Extract<KeystrokeKind, 'correct' | 'incorrect' | 'extra'>;
   blocked: boolean;
} {
   const extraCount = Math.max(0, typedSoFar.length - activeWord.length);
   if (extraCount >= MAX_EXTRA_LETTERS) {
      return { expected: null, kind: 'extra', blocked: true };
   }

   const expected = activeWord[typedSoFar.length] ?? null;
   if (expected === null) {
      return { expected: null, kind: 'extra', blocked: false };
   }

   return {
      expected,
      kind: key === expected ? 'correct' : 'incorrect',
      blocked: false,
   };
}

export function appendKeystroke(entry: Omit<Keystroke, 'timestampMs'>): void {
   const timestampMs = keystrokeTimestamp();
   wordStore.setState((state) => ({
      keystrokeLog: [
         ...state.keystrokeLog,
         {
            key: entry.key,
            expected: entry.expected,
            kind: entry.kind,
            wordIndex: entry.wordIndex,
            timestampMs,
         },
      ],
   }));
}

function wordsElapsedMs(log: readonly Keystroke[]): number {
   let first = Number.POSITIVE_INFINITY;
   let last = Number.NEGATIVE_INFINITY;
   let count = 0;

   for (const event of log) {
      const stamp = event.timestampMs;
      if (!Number.isFinite(stamp)) continue;
      count += 1;
      if (stamp < first) first = stamp;
      if (stamp > last) last = stamp;
   }

   if (count < 2) return 1;

   const span = last - first;
   if (span <= 0) return 1;

   // The first keystroke is the clock origin, so `span` is only the later gaps.
   return (span * count) / (count - 1);
}

export function testDuration(
   log: readonly Keystroke[],
   category: string,
   configuredSeconds: number
): { durationMs: number; durationSeconds: number } {
   if (category !== 'words') {
      return {
         durationMs: configuredSeconds * 1000,
         durationSeconds: configuredSeconds,
      };
   }

   const durationMs = wordsElapsedMs(log);
   return { durationMs, durationSeconds: durationMs / 1000 };
}

export function syncKeystrokeStats(): void {
   const { keystrokeLog, wordList } = wordStore.getState();
   const stats = calculateStats({
      log: keystrokeLog,
      words: wordList,
      durationMs: 1000,
   });
   wordStore.setState({
      errorCount: stats.errors,
      typedEntries: stats.typedEntries,
   });
}

export function describeKeystrokeLog(
   log: readonly Keystroke[],
   wordList: readonly string[],
   durationSeconds: number
): { words: string[]; wordCount: number; stats: TestStats } {
   const replayed = replayKeystrokeLog(log, wordList);
   const words = wordList.slice(0, replayed.activeIndex + 1);
   const current = replayed.typedWords[replayed.activeIndex] ?? '';
   const wordCount = replayed.activeIndex + (current.length > 0 ? 1 : 0);
   return {
      words,
      wordCount,
      stats: calculateStats({
         log,
         words,
         durationMs: durationSeconds * 1000,
      }),
   };
}

export function buildFinishedResult(): SavedTestResult | null {
   const { keystrokeLog, wordList } = wordStore.getState();
   if (keystrokeLog.length === 0) return null;

   const { time, type, category, language } = userConfigStore.getState();
   const { durationSeconds } = testDuration(keystrokeLog, category, time);
   const described = describeKeystrokeLog(
      keystrokeLog,
      wordList,
      durationSeconds
   );

   return {
      id: globalThis.crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      mode: type,
      category,
      language,
      durationSeconds,
      wordCount: described.wordCount,
      words: described.words,
      log: compactLog(keystrokeLog),
      stats: described.stats,
   };
}
