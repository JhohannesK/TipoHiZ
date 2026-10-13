'use client';

import { useEffect } from 'react';
import { authClient } from '@/lib/auth-client';
import {
   migrateGuestResults,
   setResultPersistenceMode,
} from '@/lib/stats/persist-client';

export default function ResultSync() {
   const session = authClient.useSession();
   const userId = session.data?.user?.id;

   useEffect(() => {
      if (session.isPending) return;
      if (!userId) {
         setResultPersistenceMode('guest');
         return;
      }
      setResultPersistenceMode('account');
      void migrateGuestResults();
   }, [session.isPending, userId]);

   return null;
}
