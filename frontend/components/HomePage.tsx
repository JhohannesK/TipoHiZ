import React from 'react';
import { MdLanguage } from 'react-icons/md';
import { BsArrowRepeat } from 'react-icons/bs';
import TextArea from './TextArea';
import { useHotkeys } from 'react-hotkeys-hook';
import UserSelectPallete from './UserSelectPallete';
import { userConfigStore, wordStore } from '../store';
import { ResetTest } from '../helpers/reset';
import { setUserInput } from '../store/actions/WordActions';
// import Timer, { startTimeCountDown } from '../modules/Timer';

const HomePage = () => {
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
      <div className="xl:max-w-6xl mx-auto font-poppins">
         <UserSelectPallete />
         <div className="flex items-center mt-16 justify-between sm:px-10">
            {/* Time display */}
            <div className="text-2xl font-medium font-poppins text-emerald-400">
               {/* <Timer /> */}
            </div>
            <div className="flex items-center justify-center gap-x-3 lowercase tracking-widest">
               <MdLanguage />
               <p className="cursor-pointer">english</p>
            </div>
         </div>

         <TextArea />

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
      </div>
   );
};

export default HomePage;
