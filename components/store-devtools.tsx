'use client';

import { useEffect } from 'react';
import { mountStoreDevtool } from 'simple-zustand-devtools';
import { userConfigStore, wordStore } from '@/store';

export default function StoreDevtools() {
   useEffect(() => {
      // A root created before hydration marks the document as listening,
      // and the page root never receives clicks.
      mountStoreDevtool('userStore', userConfigStore);
      mountStoreDevtool('wordStore', wordStore);
   }, []);

   return null;
}
