import { useEffect, useRef } from 'react';
import { isShiftEnter, isTypingInOtherField } from '@/lib/restart-shortcut';

export function useShiftEnterRestart(onRestart: () => void): void {
   const onRestartRef = useRef(onRestart);
   onRestartRef.current = onRestart;

   useEffect(() => {
      function handleKeydown(event: KeyboardEvent) {
         if (event.isComposing || !isShiftEnter(event)) return;
         if (isTypingInOtherField(event.target)) return;

         event.preventDefault();
         onRestartRef.current();
      }

      document.addEventListener('keydown', handleKeydown);

      return () => {
         document.removeEventListener('keydown', handleKeydown);
      };
   }, []);
}
