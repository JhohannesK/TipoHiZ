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
      wordStore.setState(() => {
         return {
            typedHistory: [],
         };
      });
      // BUG: TAB appears in the typeHistory and the tab is pressed to reset.
      ResetTest(timerid, type);
      // document.getElementsByClassName('startView')[0].scrollIntoView();
   });

   // const { time } = wordStore(({ time }) => ({ time }));
   return (
      <div className="flex items-center justify-center pt-8 space-x-4">
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
