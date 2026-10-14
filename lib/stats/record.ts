import { userConfigStore, wordStore } from '../../store';
import { calculateStats, replayKeystrokeLog } from './calculate';
import { keystrokeTimestamp } from './clock';
import { compactLog, MAX_EXTRA_LETTERS } from './types';
import type { Keystroke, KeystrokeKind, SavedTestResult } from './types';

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

   let elapsed = 0;
   for (const event of log) {
      if (event.timestampMs > elapsed) elapsed = event.timestampMs;
   }
   const durationMs = Math.max(elapsed, 1);
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

export function buildFinishedResult(): SavedTestResult | null {
   const { keystrokeLog, wordList } = wordStore.getState();
   if (keystrokeLog.length === 0) return null;

   const replayed = replayKeystrokeLog(keystrokeLog, wordList);
   const words = wordList.slice(0, replayed.activeIndex + 1);
   const current = replayed.typedWords[replayed.activeIndex] ?? '';
   const wordCount = replayed.activeIndex + (current.length > 0 ? 1 : 0);
   const { time, type, category, language } = userConfigStore.getState();
   const { durationMs, durationSeconds } = testDuration(
      keystrokeLog,
      category,
      time
   );
   const stats = calculateStats({
      log: keystrokeLog,
      words,
      durationMs,
   });

   return {
      id: globalThis.crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      mode: type,
      category,
      language,
      durationSeconds,
      wordCount,
      words,
      log: compactLog(keystrokeLog),
      stats,
   };
}
