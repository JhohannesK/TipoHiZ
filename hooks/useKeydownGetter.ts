'use client';
import { wordStore } from '@/store';
import { useEffect } from 'react';
import { HandleText } from '../lib/handle-text';

const useKeydownGetter = ({ run }: { run: () => void; reset: () => void }) => {
   const { activeWordRef } = wordStore((state) => state);

   useEffect(() => {
      document.onkeydown = (e) => {
         if (
            (e.key.length === 1 || e.key === 'Backspace') &&
            !e.ctrlKey &&
            !e.shiftKey &&
            !e.altKey && // Check if Control, Shift, or Alt keys are pressed
            e.key !== 'Enter' &&
            e.key !== 'Tab' // Exclude Enter, Tab, and Space keys
         ) {
            HandleText(e.key, activeWordRef, run);
            // run()
            e.preventDefault();
         } else if (
            e.shiftKey &&
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.altKey
         ) {
            const charToAdd = e.key.toUpperCase(); // Convert to uppercase if Shift is pressed
            HandleText(`Shift${charToAdd}`, activeWordRef, run);
            e.preventDefault();
         }
      };
      return () => {
         document.onkeydown = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [activeWordRef]);
   return {};
};

export default useKeydownGetter;
