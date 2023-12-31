'use client';

import { ResetTest } from '@/helpers/reset';
import { wordStore, userConfigStore } from '@/store';
import { setUserInput } from '@/store/actions/WordActions';
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
      <div className="pt-8 flex items-center justify-center space-x-4">
         <BsArrowRepeat
            className="hover:rotate-180 transition-all duration-500 ease-out cursor-pointer active:scale-150 active:text-green-300"
            size={30}
            onClick={(e) => {
               // setTime(time);
               ResetTest(timerid, type);
               setUserInput('');
               e.preventDefault();
            }}
         />
      </div>
   );
}
