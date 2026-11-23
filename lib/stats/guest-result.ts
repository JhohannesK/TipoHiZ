import type { CompactKeystroke, KeystrokeKind, SavedTestResult } from './types';

const KINDS = new Set<KeystrokeKind>([
   'correct',
   'incorrect',
   'extra',
   'backspace',
]);

export function isCompactKeystroke(value: unknown): value is CompactKeystroke {
   if (!Array.isArray(value) || value.length !== 5) return false;
   const [key, expected, kind, timestampMs, wordIndex] = value;
   return (
      typeof key === 'string' &&
      (expected === null || typeof expected === 'string') &&
      typeof kind === 'string' &&
      KINDS.has(kind as KeystrokeKind) &&
      typeof timestampMs === 'number' &&
      typeof wordIndex === 'number'
   );
}

export function isStoredGuestResult(value: unknown): value is SavedTestResult {
   if (!value || typeof value !== 'object') return false;
   const record = value as Partial<SavedTestResult>;
   return (
      typeof record.id === 'string' &&
      typeof record.createdAt === 'string' &&
      typeof record.mode === 'string' &&
      typeof record.category === 'string' &&
      typeof record.language === 'string' &&
      typeof record.durationSeconds === 'number' &&
      typeof record.wordCount === 'number' &&
      Array.isArray(record.words) &&
      record.words.every((word) => typeof word === 'string') &&
      Array.isArray(record.log) &&
      record.log.every(isCompactKeystroke) &&
      record.stats !== undefined
   );
}
