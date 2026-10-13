import { GUEST_RESULT_LIMIT } from './types';
import type { CompactKeystroke, KeystrokeKind, SavedTestResult } from './types';

export const GUEST_RESULTS_KEY = 'tipohiz.results';
export const LAST_RESULT_KEY = 'tipohiz.lastResult';
export const RESULT_EVENT = 'tipohiz-results';

export interface ClientResultsSnapshot {
   history: SavedTestResult[];
   last: SavedTestResult | null;
}

const EMPTY_SNAPSHOT: ClientResultsSnapshot = { history: [], last: null };

let cachedSnapshotKey: string | undefined;
let cachedSnapshot: ClientResultsSnapshot = EMPTY_SNAPSHOT;

const KINDS = new Set<KeystrokeKind>([
   'correct',
   'incorrect',
   'extra',
   'backspace',
]);

function isCompact(value: unknown): value is CompactKeystroke {
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

function isResult(value: unknown): value is SavedTestResult {
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
      record.log.every(isCompact) &&
      record.stats !== undefined
   );
}

function parseHistory(raw: string | null): SavedTestResult[] {
   if (!raw) return [];
   try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isResult);
   } catch {
      return [];
   }
}

function parseLast(raw: string | null): SavedTestResult | null {
   if (!raw) return null;
   try {
      const parsed: unknown = JSON.parse(raw);
      return isResult(parsed) ? parsed : null;
   } catch {
      return null;
   }
}

function emit(): void {
   if (typeof window === 'undefined') return;
   window.dispatchEvent(new Event(RESULT_EVENT));
}

function invalidate(): void {
   cachedSnapshotKey = undefined;
   emit();
}

export function loadClientResults(): ClientResultsSnapshot {
   if (typeof window === 'undefined') return EMPTY_SNAPSHOT;
   const historyRaw = window.localStorage.getItem(GUEST_RESULTS_KEY);
   const lastRaw = window.sessionStorage.getItem(LAST_RESULT_KEY);
   const key = `${historyRaw ?? ''}\n${lastRaw ?? ''}`;
   if (key === cachedSnapshotKey) return cachedSnapshot;
   cachedSnapshotKey = key;
   cachedSnapshot = {
      history: parseHistory(historyRaw),
      last: parseLast(lastRaw),
   };
   return cachedSnapshot;
}

export function loadServerResults(): ClientResultsSnapshot {
   return EMPTY_SNAPSHOT;
}

export function subscribeClientResults(onChange: () => void): () => void {
   window.addEventListener('storage', onChange);
   window.addEventListener(RESULT_EVENT, onChange);
   return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener(RESULT_EVENT, onChange);
   };
}

export function loadGuestResults(): SavedTestResult[] {
   return loadClientResults().history;
}

export function saveGuestResult(result: SavedTestResult): SavedTestResult[] {
   if (typeof window === 'undefined') return [];
   const next = [
      result,
      ...loadGuestResults().filter((item) => item.id !== result.id),
   ].slice(0, GUEST_RESULT_LIMIT);
   window.localStorage.setItem(GUEST_RESULTS_KEY, JSON.stringify(next));
   invalidate();
   return next;
}

export function clearGuestResults(): void {
   if (typeof window === 'undefined') return;
   window.localStorage.removeItem(GUEST_RESULTS_KEY);
   invalidate();
}

export function rememberLastResult(result: SavedTestResult): void {
   if (typeof window === 'undefined') return;
   window.sessionStorage.setItem(LAST_RESULT_KEY, JSON.stringify(result));
   invalidate();
}
