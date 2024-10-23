'use client';
import React from 'react';
import TextArea from '@/components/TextArea';
import UserSelectPallete from '@/components/UserSelectPallete';
import ResetTestButton from '@/components/reset-test-button';
import useTimer from '@/hooks/useTimer';
import { userConfigStore } from '@/store';
import useKeydownGetter from '@/hooks/useKeydownGetter';
import { IoIosColorPalette } from 'react-icons/io';
import ThemeChoose from '@/components/expo/theme-choose';

export default function HomePage() {
   const { time } = userConfigStore((state) => state);
   const { timer, run, reset } = useTimer(1, time);
   const { sound } = userConfigStore();

   useKeydownGetter({ run, reset });
   return (
      <div>
         <UserSelectPallete reset={reset} />
         <div className="flex items-center justify-between mt-16 sm:px-10">
            <div className="text-xl font-medium font-poppins text-accent flex-wrap">
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
