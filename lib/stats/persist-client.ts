import { buildFinishedResult } from './record';
import { trackTestFinished } from './usage';
import {
   clearGuestResults,
   loadGuestResults,
   rememberLastResult,
   saveGuestResult,
} from './storage';
import { submissionOf } from './types';
import type { SavedTestResult } from './types';

type PersistenceMode = 'guest' | 'account';

let mode: PersistenceMode = 'guest';

export function setResultPersistenceMode(next: PersistenceMode): void {
   mode = next;
}

export function resultPersistenceMode(): PersistenceMode {
   return mode;
}

async function postResults(
   path: '/api/results' | '/api/results/migrate',
   body: unknown
): Promise<boolean> {
   try {
      const response = await fetch(path, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(body),
      });
      return response.ok;
   } catch {
      return false;
   }
}

export function persistFinishedTest(): SavedTestResult | null {
   const result = buildFinishedResult();
   if (!result) return null;

   trackTestFinished(result.wordCount);
   rememberLastResult(result);
   if (mode === 'account') {
      void postResults('/api/results', { result: submissionOf(result) }).then(
         (saved) => {
            if (!saved) saveGuestResult(result);
         }
      );
      return result;
   }

   saveGuestResult(result);
   return result;
}

export async function migrateGuestResults(): Promise<boolean> {
   const pending = loadGuestResults();
   if (pending.length === 0) return true;
   const saved = await postResults('/api/results/migrate', {
      results: pending.map(submissionOf),
   });
   if (saved) clearGuestResults();
   return saved;
}
