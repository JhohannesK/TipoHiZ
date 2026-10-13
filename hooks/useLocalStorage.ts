'use client';

import { useEffect, useState } from 'react';

export function useLocalStorage<T>(key: string, fallbackValue: T) {
   const [value, setValue] = useState<T>(fallbackValue);
   const [hydrated, setHydrated] = useState(false);

   useEffect(() => {
      if (typeof window === 'undefined') return;
      try {
         const stored = window.localStorage.getItem(key);
         if (stored == null) {
            setValue(fallbackValue);
         } else {
            setValue(JSON.parse(stored) as T);
         }
      } catch {
         setValue(fallbackValue);
      } finally {
         setHydrated(true);
      }
   }, [fallbackValue, key]);

   useEffect(() => {
      // Prevent overwriting a previously-stored value on initial mount.
      if (!hydrated) return;
      if (typeof window === 'undefined') return;
      try {
         window.localStorage.setItem(key, JSON.stringify(value));
      } catch {
         // ignore storage write errors (quota/private mode/etc.)
      }
   }, [key, value]);

   return [value, setValue] as const;
}
