import React from 'react';
import { resetTest } from '@/helpers/reset';
import { userConfigStore } from '@/store';
import { setCaretRef, setUserInput } from '@/store/actions/WordActions';
import { BsArrowRepeat } from 'react-icons/bs';

export default function ResetTestButton({ reset }: { reset: () => void }) {
   const { type } = userConfigStore((state) => state);

   return (
      <button
         className="flex items-center justify-center gap-4 pt-8 text-input px-3 pb-2 mx-auto"
         aria-label="button to restart test"
         onClick={(e) => {
            // setDefaultTime(time);
            resetTest(type, reset);
            setUserInput('');
            setCaretRef(null);
            e.preventDefault();
         }}
      >
         <BsArrowRepeat
            className="transition-all duration-500 ease-out cursor-pointer hover:rotate-180 active:scale-150 active:text-accent"
            size={30}
         />
      </button>
   );
}
