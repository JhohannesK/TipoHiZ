'use client';
import React from 'react';
import TextArea from '@/components/TextArea';
import UserSelectPallete from '@/components/UserSelectPallete';
import ResetTestButton from '@/components/reset-test-button';
import useTimer from '@/helpers/utils/useTimer';
import { userConfigStore } from '@/store';
import useKeydownGetter from '@/helpers/utils/useKeydownGetter';
import { IoIosColorPalette } from 'react-icons/io';
import ThemeChoose from '@/components/expo/theme-choose';
import { useSettings } from '@/components/UI/settings-context';

export default function HomePage() {
   const { time } = userConfigStore((state) => state);
   const { timer, run, reset } = useTimer(1, time);
   const { sound } = useSettings();


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
