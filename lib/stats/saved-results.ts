import { mergeResults } from './aggregate';
import type { SavedTestResult } from './types';

export function accountResultsFromResponse(
   ok: boolean,
   results?: SavedTestResult[] | null
): SavedTestResult[] {
   if (!ok) return [];
   return results ?? [];
}

export function visibleSavedResults(input: {
   signedIn: boolean;
   account: SavedTestResult[] | null;
   history: SavedTestResult[];
   last: SavedTestResult | null;
}): SavedTestResult[] {
   const carried = input.last ? [input.last] : [];
   if (input.signedIn) {
      return mergeResults(input.account ?? [], [...input.history, ...carried]);
   }
   return mergeResults(input.history, carried);
}
