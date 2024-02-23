'use client';
import { wordStore } from '@/store';
import { useEffect } from 'react';
import { useHandleText } from './useHandleText';

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
            useHandleText(e.key, activeWordRef, run);
            // run()
            e.preventDefault();
         }
      };

      return () => {
         document.onkeydown = null;
      };
   }, [activeWordRef]);

   // useHotkeys('tab+enter', () => {
   //    resetTest(type, reset);
   //    wordStore.setState(() => {
   //       return {
   //          typedHistory: [],
   //          userInput: '',
   //       };
   //    });
   // });
   return {};
};

export default useKeydownGetter;
