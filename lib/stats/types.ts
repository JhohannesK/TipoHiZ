export const MAX_EXTRA_LETTERS = 10;

export const GUEST_RESULT_LIMIT = 50;

export type KeystrokeKind = 'correct' | 'incorrect' | 'extra' | 'backspace';

export interface Keystroke {
   key: string;
   expected: string | null;
   kind: KeystrokeKind;
   timestampMs: number;
   wordIndex: number;
}

export type CompactKeystroke = [
   key: string,
   expected: string | null,
   kind: KeystrokeKind,
   timestampMs: number,
   wordIndex: number
];

export interface SecondSample {
   second: number;
   wpm: number;
   rawWpm: number;
   accuracy: number;
   characters: number;
   errors: number;
}

export interface PerKeyStat {
   key: string;
   correct: number;
   incorrect: number;
   extra: number;
   accuracy: number;
}

export interface TestStats {
   wpm: number;
   rawWpm: number;
   accuracy: number;
   consistency: number;
   typedEntries: number;
   errors: number;
   correct: number;
   incorrect: number;
   extra: number;
   missed: number;
   samples: SecondSample[];
   perKey: PerKeyStat[];
}

export interface ResultSubmission {
   id: string;
   createdAt: string;
   mode: string;
   category: string;
   language: string;
   durationSeconds: number;
   wordCount: number;
   words: string[];
   log: CompactKeystroke[];
}

export interface SavedTestResult extends ResultSubmission {
   stats: TestStats;
}

export function compactLog(log: readonly Keystroke[]): CompactKeystroke[] {
   return log.map((entry) => [
      entry.key,
      entry.expected,
      entry.kind,
      entry.timestampMs,
      entry.wordIndex,
   ]);
}

export function expandLog(log: readonly CompactKeystroke[]): Keystroke[] {
   return log.map(([key, expected, kind, timestampMs, wordIndex]) => ({
      key,
      expected,
      kind,
      timestampMs,
      wordIndex,
   }));
}

export function submissionOf(result: SavedTestResult): ResultSubmission {
   return {
      id: result.id,
      createdAt: result.createdAt,
      mode: result.mode,
      category: result.category,
      language: result.language,
      durationSeconds: result.durationSeconds,
      wordCount: result.wordCount,
      words: result.words,
      log: result.log,
   };
}
