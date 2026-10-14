'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { authClient } from '@/lib/auth-client';
import { mergeResults } from '@/lib/stats/aggregate';
import {
   loadClientResults,
   loadServerResults,
   subscribeClientResults,
} from '@/lib/stats/storage';
import type { SavedTestResult } from '@/lib/stats/types';

export function useSavedResults(): SavedTestResult[] {
   const session = authClient.useSession();
   const snapshot = useSyncExternalStore(
      subscribeClientResults,
      loadClientResults,
      loadServerResults
   );
   const signedIn = Boolean(session.data?.user);
   const userId = session.data?.user?.id;
   const [account, setAccount] = useState<SavedTestResult[] | null>(null);

   useEffect(() => {
      if (!signedIn) return;
      let cancelled = false;

      void fetch('/api/results')
         .then(async (response) => {
            if (!response.ok) throw new Error('failed');
            return (await response.json()) as { results?: SavedTestResult[] };
         })
         .then((body) => {
            if (!cancelled) setAccount(body.results ?? []);
         })
         .catch(() => {
            if (!cancelled) setAccount([]);
         });

      return () => {
         cancelled = true;
      };
   }, [signedIn, userId]);

   const carried = snapshot.last ? [snapshot.last] : [];
   if (signedIn) {
      return mergeResults(account ?? [], [...snapshot.history, ...carried]);
   }
   return mergeResults(snapshot.history, carried);
}
