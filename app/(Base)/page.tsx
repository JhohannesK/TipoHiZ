'use client';
import React, { useState } from 'react';
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
   useKeydownGetter({ run, reset });
   const [language, setLanguage] = useState<'english' | 'french'>('english');
   const toggleLanguage = () => {
      setLanguage((prev) => (prev === 'english' ? 'french' : 'english'));
   };

   return (
      <div>
         <UserSelectPallete reset={reset} />
         <div className="flex items-center justify-between mt-16 sm:px-10">
            <div className="text-2xl font-medium font-poppins text-accent">
               <div>{timer}</div>
            </div>
            <div className="flex items-center justify-center mb-4 tracking-widest lowercase text-input gap-x-3">
               <MdLanguage />
               <p className="cursor-pointer" onClick={toggleLanguage}>
                  {language === 'english' ? 'english' : 'français'}
               </p>
            </div>
            <div>
               <div className="flex items-center gap-1 cursor-pointer text-input">
                  <IoIosColorPalette />
                  <ThemeChoose />
               </div>
            </div>
         </div>
         <TextArea language={language} />
         <ResetTestButton reset={reset} />
      </div>
   );
}
