'use client';
import React from 'react';
import { ResetTest } from '@/helpers/reset';
import { wordStore, userConfigStore } from '@/store';
import { setCaretRef, setUserInput } from '@/store/actions/WordActions';
import { useHotkeys } from 'react-hotkeys-hook';
import { BsArrowRepeat } from 'react-icons/bs';

export default function ResetTestButton() {
   const timerid = wordStore((state) => state.timerId);
   const { type } = userConfigStore((state) => state);
   useHotkeys('tab', () => {
      console.log('tab pressed');
      wordStore.setState(() => {
         return {
            typedHistory: [],
            userInput: '',
         };
      });
      ResetTest(timerid, type);
   });

   // const { time } = wordStore(({ time }) => ({ time }));
   return (
      <div className="flex items-center justify-center gap-4 pt-8">
         <BsArrowRepeat
            className="transition-all duration-500 ease-out cursor-pointer hover:rotate-180 active:scale-150 active:text-green-300"
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
