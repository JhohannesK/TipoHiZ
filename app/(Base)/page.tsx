'use client';
import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import TextArea from '@/components/TextArea';
import UserSelectPallete from '@/components/user-select-pallete';
import ResetTestButton from '@/components/reset-test-button';
import { userConfigStore, wordStore } from '@/store';
import { setLanguage } from '@/store/actions/ConfigActions';
import { IoIosColorPalette } from 'react-icons/io';
import useTimer from '@/hooks/useTimer';
import useElapsed from '@/hooks/useElapsed';
import ThemeChoose from '@/components/expo/theme-choose';
import { Globe } from 'lucide-react';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { languageOptions } from '@/lib/i18n';
import { resetTest } from '@/lib/reset';
import { persistFinishedTest } from '@/lib/stats/persist-client';
import { formatElapsed, resolveWordCount } from '@/lib/words';
import {
   abandonTest,
   trackTestFinished,
   trackTestStarted,
} from '@/lib/usage-events';

export default function HomePage() {
   const { time, language, type, category, wordCount, sound } = userConfigStore(
      (state) => state
   );
   const completed = wordStore((state) => state.nextIndex);
   const wordsMode = category === 'words';
   const countdown = useTimer(
      1,
      time,
      true,
      false,
      wordsMode ? null : trackTestFinished
   );
   const elapsed = useElapsed();
   const router = useRouter();
   const finishedRef = useRef(false);
   const totalWords = resolveWordCount(wordCount);

   const reset = () => {
      finishedRef.current = false;
      abandonTest();
      countdown.reset();
      elapsed.reset();
   };

   const beginTest = () => {
      trackTestStarted();
      if (userConfigStore.getState().category === 'words') elapsed.run();
      else countdown.run();
   };

   const finishWords = () => {
      if (finishedRef.current) return;
      if (userConfigStore.getState().category !== 'words') return;
      finishedRef.current = true;
      trackTestFinished();
      persistFinishedTest();
      router.push('/results');
   };

   const handleLanguageChange = (value: string) => {
      setLanguage(value);
      void resetTest(type, reset);
   };

   return (
      <div>
         <UserSelectPallete reset={reset} />
         <div className="mt-16 flex items-center justify-between gap-3 sm:gap-0 sm:px-10">
            <div className="flex-wrap text-xl font-medium font-poppins text-accent">
               {wordsMode ? (
                  <div className="mb-2 flex items-baseline gap-4">
                     <span data-testid="words-progress">
                        {Math.min(completed, totalWords)}/{totalWords}
                     </span>
                     <span data-testid="elapsed-time">
                        {formatElapsed(elapsed.elapsed)}
                     </span>
                  </div>
               ) : (
                  <div className="mb-2">{countdown.timer}</div>
               )}
            </div>

            <div className="flex items-center gap-3 text-input">
               <Globe size={15} />
               <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-[110px]">
                     <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                     {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                           {option.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>

            <div>
               <div className="flex items-center gap-1 mb-3 cursor-pointer text-input">
                  <IoIosColorPalette />
                  <ThemeChoose />
               </div>
            </div>
         </div>
         <TextArea sound={sound} run={beginTest} onFinish={finishWords} />
         <ResetTestButton reset={reset} />
      </div>
   );
}
