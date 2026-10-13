import { useEffect, useRef } from 'react';
import { BsArrowRepeat } from 'react-icons/bs';
import { resetTest } from '@/lib/reset';
import { isShiftEnter, isTypingInOtherField } from '@/lib/restart-shortcut';
import { userConfigStore } from '@/store';
import { resetStates } from '@/store/actions/TimeActions';
import { setCaretRef, setUserInput } from '@/store/actions/WordActions';

function restartFromStore(reset: () => void) {
   const { type } = userConfigStore.getState();
   resetTest(type, reset);
   reset();
   resetStates();
   setUserInput('');
   setCaretRef(null);
}

export default function ResetTestButton({ reset }: { reset: () => void }) {
   const resetRef = useRef(reset);
   resetRef.current = reset;
   const previousKeyRef = useRef('');

   useEffect(() => {
      function handleKeydown(event: KeyboardEvent) {
         if (event.isComposing || isTypingInOtherField(event.target)) {
            previousKeyRef.current = '';
            return;
         }

         if (event.key === 'Tab') {
            event.preventDefault();
            previousKeyRef.current = event.key;
            return;
         }

         const tabThenEnter =
            event.key === 'Enter' && previousKeyRef.current === 'Tab';

         if (!tabThenEnter && !isShiftEnter(event)) {
            previousKeyRef.current = '';
            return;
         }

         event.preventDefault();
         previousKeyRef.current = '';
         restartFromStore(resetRef.current);
      }

      document.addEventListener('keydown', handleKeydown);

      return () => {
         document.removeEventListener('keydown', handleKeydown);
      };
   }, []);

   return (
      <button
         className="flex items-center justify-center gap-4 px-3 pt-8 pb-2 mx-auto text-input"
         aria-label="button to restart test"
         onClick={(event) => {
            restartFromStore(resetRef.current);
            event.preventDefault();
         }}
      >
         <BsArrowRepeat
            className="transition-all duration-500 ease-out cursor-pointer hover:rotate-180 active:scale-150 active:text-accent"
            size={30}
         />
         Restart test
      </button>
   );
}
