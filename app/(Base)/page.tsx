'use client';
import React from 'react';
import TextArea from '@/components/TextArea';
import UserSelectPallete from '@/components/UserSelectPallete';
import ResetTestButton from '@/components/reset-test-button';
import { MdLanguage } from 'react-icons/md';
import useTimer from '@/helpers/utils/useTimer';
import { userConfigStore } from '@/store';
import useKeydownGetter from '@/helpers/utils/useKeydownGetter';
import { IoIosColorPalette } from 'react-icons/io';
import ThemeChoose from '@/components/expo/theme-choose';

export default function HomePage() {
   const { time } = userConfigStore((state) => state);
   const { timer, run, reset } = useTimer(1, time);
   const [sound, setSound] = React.useState(true);

   const handleSound = () => {
      const typingSound = new Audio('/modules/AudioFiles/type.mp3');
      if (sound) {
         setSound(false);
         typingSound.volume = 0;
      } else {
         setSound(true);
         typingSound.volume = 0.1;
      }
   };
   useKeydownGetter({ run, reset });
   return (
      <div>
         <UserSelectPallete reset={reset} />
         <div className="flex items-center justify-between mt-16 sm:px-10">
            <div className="text-xl font-medium font-poppins text-accent flex-wrap">
               {/* <button
                  className={`flex font-bold items-center justify-center rounded py-2 mt-5 text-input w-48 ${
                     isRunning || isExited ? 'bg-background' : 'bg-foreground'
                  }`}
                  onClick={run}
                  disabled={isRunning || isExited}
               >
                  start
               </button> */}
               <div className="mb-2">{timer}</div>
            </div>
            <div className="flex items-center justify-center mb-4 tracking-widest lowercase text-input gap-x-1">
               <MdLanguage className="mt-2" />
               <p className="cursor-pointer mt-2">english</p>
            </div>

            <div className="flex items-center justify-center mb-4 tracking-widest lowercase text-input gap-x-1">
               <button className="outline-none" onClick={handleSound}>
                  {sound ? 'Sound: On' : 'Sound: Off'}
               </button>
            </div>

            <div>
               <div className="flex items-center gap-1 cursor-pointer text-input mb-3">
                  <IoIosColorPalette />
                  <ThemeChoose />
               </div>
            </div>
         </div>
         <TextArea sound={sound} />
         <ResetTestButton reset={reset} />
      </div>
   );
}
