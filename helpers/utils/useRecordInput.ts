import { wordStore } from '@/store';
import React from 'react';
import { useHandleText } from './useHandleText';

export default function useRecordInput() {
   const { activeWordRef } = wordStore((state) => state);
   const { caretRef } = wordStore((state) => state);

   React.useEffect(() => {
      document.onkeydown = (e) => {
         if (e.key.length === 1 || e.key === 'Backspace' || e.key === 'Tab') {
            useHandleText(e.key, e.ctrlKey, caretRef, activeWordRef);
            e.preventDefault();
         }
      };
      return () => {
         document.onkeydown = null;
      };
   }, [activeWordRef]);
}
