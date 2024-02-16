'use client';
import React from 'react';
import { ResetTest } from '@/helpers/reset';
import { wordStore, userConfigStore } from '@/store';
import { setCaretRef, setUserInput } from '@/store/actions/WordActions';
import { BsArrowRepeat } from 'react-icons/bs';

export default function ResetTestButton() {
   const timerid = wordStore((state) => state.timerId);
   const { type } = userConfigStore((state) => state);

   // const { time } = wordStore(({ time }) => ({ time }));
   return (
      <div className="flex items-center justify-center gap-4 pt-8 text-input">
         <BsArrowRepeat
            className="transition-all duration-500 ease-out cursor-pointer hover:rotate-180 active:scale-150 active:text-accent"
            size={30}
            onClick={(e) => {
               // setTime(time);
               ResetTest(timerid, type);
               setUserInput('');
               setCaretRef(null);
               e.preventDefault();
            }}
         />
      </div>
   );
}
