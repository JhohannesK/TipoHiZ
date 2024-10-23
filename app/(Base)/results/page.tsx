'use client';
import React from 'react';
import { StatCard } from '@/components/StatCard';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { userConfigStore, wordStore } from '@/store';
import Link from 'next/link';
import { accurateWPM, formatTime, grossWPM } from '@/lib/utils';

const LANGUAGES = ['English', 'Spanish', 'French', 'German'];
const SHOW_ALL_TIME_STATS = false;

export default function ResultsPage() {
   const { typedEntries, errorCount } = wordStore.getState();
   const { time, category } = userConfigStore.getState();

   const rawWpm = grossWPM(typedEntries, time);

   const accurateWpm = accurateWPM(errorCount, typedEntries, time);

   return (
      <div className="pb-8 text-input">
         <h1 className="sr-only">Game Results page</h1>
         <div className="pt-6 space-y-8">
            <div className="flex gap-2 max-sm:flex-col sm:items-center">
               <h2 className="font-medium sm:text-lg">Show Statistics for:</h2>
               <Select defaultValue={LANGUAGES[0]}>
                  <SelectTrigger className="max-w-[350px] w-full">
                     <SelectValue placeholder="Language" />
                  </SelectTrigger>
                  <SelectContent>
                     {LANGUAGES.map((lang) => (
                        <SelectItem value={lang} key={lang}>
                           {lang}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
            <div className="space-y-6">
               <div className="space-y-4">
                  <h2 className="text-lg font-medium sm:text-xl">
                     Current Results
                  </h2>
                  <div className="flex flex-wrap items-center gap-4">
                     <StatCard label={category} value={formatTime(time)} />
                     <StatCard
                        label="Average Speed"
                        value={`${accurateWpm.toFixed(2)}wpm`}
                     />
                     <StatCard
                        label="Total Speed"
                        value={`${rawWpm.toFixed(2)}wpm`}
                     />
                  </div>
               </div>
               {SHOW_ALL_TIME_STATS && (
                  <div className="space-y-4">
                     <h2 className="text-lg font-medium sm:text-xl">
                        All Time Statistics
                     </h2>
                     <div className="flex flex-wrap items-center gap-4">
                        <StatCard label="Time" value="00:60:00" />
                        <StatCard label="Average Speed" value="45.2wpm" />
                        <StatCard label="Test Type" value="Hard" />
                        <StatCard label="Top Accuracy" value="91.8%" />
                        <StatCard label="Average Accuracy" value="91.8%" />
                     </div>
                  </div>
               )}
            </div>
            <div className="max-w-[100px] sm:max-w-[150px] sm:pt-4">
               <Link
                  href={'/'}
                  className="block w-full py-2 text-sm font-medium text-center transition-all duration-200 rounded-lg sm:px-6 bg-input/10 hover:bg-accent sm:text-lg"
               >
                  Retake
               </Link>
            </div>
         </div>
      </div>
   );
}
