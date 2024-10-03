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

   const [selectedLanguage, setSelectedLanguage] = useState<string>('en'); // State to hold selected language

   // Handle language change
   const handleLanguageChange = (
      event: React.ChangeEvent<HTMLSelectElement>
   ) => {
      setSelectedLanguage(event.target.value);
   };

   return (
      <div>
         <UserSelectPallete reset={reset} />
         <div className="flex items-center justify-between mt-16 sm:px-10">
            <div className="text-2xl font-medium font-poppins text-accent">
               <div>{timer}</div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center justify-center mb-4 tracking-widest lowercase text-input gap-x-3">
               <MdLanguage />
               <select
                  className="cursor-pointer bg-background text-foreground border border-gray-300 rounded-md px-2 py-1"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
               >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh-CN">Chinese (Simplified)</option>
                  <option value="zh-TW">Chinese (Traditional)</option>
                  <option value="ja">Japanese</option>
                  <option value="ko">Korean</option>
                  <option value="ru">Russian</option>
                  <option value="it">Italian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ar">Arabic</option>
                  <option value="hi">Hindi</option>
                  <option value="bn">Bengali</option>
                  <option value="ms">Malay</option>
                  <option value="tr">Turkish</option>
                  <option value="vi">Vietnamese</option>
                  <option value="th">Thai</option>
                  <option value="nl">Dutch</option>
                  <option value="pl">Polish</option>
                  <option value="sv">Swedish</option>
                  <option value="da">Danish</option>
                  <option value="no">Norwegian</option>
                  <option value="fi">Finnish</option>
                  <option value="he">Hebrew</option>
                  <option value="uk">Ukrainian</option>
                  <option value="cs">Czech</option>
                  <option value="el">Greek</option>
                  <option value="hu">Hungarian</option>
                  <option value="ro">Romanian</option>
                  <option value="sr">Serbian</option>
                  <option value="sk">Slovak</option>
                  <option value="hr">Croatian</option>
                  <option value="bg">Bulgarian</option>
                  <option value="id">Indonesian</option>
                  <option value="fa">Persian</option>
                  <option value="sw">Swahili</option>
                  <option value="am">Amharic</option>
                  {/* Add more languages as needed */}
               </select>
            </div>

            <div>
               <div className="flex items-center gap-1 cursor-pointer text-input">
                  <IoIosColorPalette />
                  <ThemeChoose />
               </div>
            </div>
         </div>

         {/* Pass selectedLanguage as a prop to TextArea */}
         <TextArea selectedLanguage={selectedLanguage} />

         <ResetTestButton reset={reset} />
      </div>
   );
}
