import { isStoredGuestResult } from './guest-result';
import { GUEST_RESULT_LIMIT, type SavedTestResult } from './types';

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

function parseHistory(raw: string | null): SavedTestResult[] {
   if (!raw) return [];
   try {
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isStoredGuestResult);
   } catch {
      return [];
   }
}

function parseLast(raw: string | null): SavedTestResult | null {
   if (!raw) return null;
   try {
      const parsed: unknown = JSON.parse(raw);
      return isStoredGuestResult(parsed) ? parsed : null;
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
