import React, { useEffect } from 'react';
import { resetTest } from '@/lib/reset';
import { userConfigStore } from '@/store';
import { setCaretRef, setUserInput } from '@/store/actions/WordActions';
import { BsArrowRepeat } from 'react-icons/bs';
import { resetStates } from '@/store/actions/TimeActions';

export default function ResetTestButton({ reset }: { reset: () => void }) {
   const { type } = userConfigStore((state) => state);
   const previousKeyRef = React.useRef('');

   useEffect(() => {
      function handleKeydown(e: KeyboardEvent) {
         if (e.key === 'Tab') {
            e.preventDefault();
            previousKeyRef.current = e.key;
            return;
         }

         if (e.key === 'Enter' && previousKeyRef.current === 'Tab') {
            e.preventDefault();
            previousKeyRef.current = '';

            resetTest(type, reset);
            reset();
            resetStates();
            setUserInput('');
            setCaretRef(null);
            return;
         }

         previousKeyRef.current = '';
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
         onClick={(e) => {
            // setDefaultTime(time);
            resetTest(type, reset);
            reset();
            resetStates();
            setUserInput('');
            setCaretRef(null);
            e.preventDefault();
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
