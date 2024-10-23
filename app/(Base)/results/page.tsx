'use client';
import React from 'react';
import { StatCard } from '@/components/StatCard';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/UI/select';
import { accurateWPM, formatTime, grossWPM } from '@/helpers/utils/util';
import { userConfigStore, wordStore } from '@/store';
import Link from 'next/link';

const LANGUAGES = ['English', 'Spanish', 'French', 'German'];
const SHOW_ALL_TIME_STATS = false;

export default function ResultsPage() {
   const { typedEntries, errorCount } = wordStore.getState();
   const { time, category } = userConfigStore.getState();

   const rawWpmw = grossWPM(typedEntries, time);

   const accurateWpm = accurateWPM(errorCount, typedEntries, time);

   return (
      <div className="text-input pb-8">
         <h1 className="sr-only">Game Results page</h1>
         <div className="space-y-8 pt-6">
            <div className="flex max-sm:flex-col sm:items-center gap-2">
               <h2 className="sm:text-lg font-medium">Show Statistics for:</h2>
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
                  <h2 className="text-lg sm:text-xl font-medium">
                     Current Results
                  </h2>
                  <div className="flex items-center gap-4 flex-wrap">
                     <StatCard label={category} value={formatTime(time)} />
                     <StatCard
                        label="Average Speed"
                        value={`${accurateWpm.toFixed(2)}wpm`}
                     />
                     <StatCard
                        label="Total Speed"
                        value={`${rawWpmw.toFixed(2)}wpm`}
                     />
                  </div>
               </div>
               {SHOW_ALL_TIME_STATS && (
                  <div className="space-y-4">
                     <h2 className="text-lg sm:text-xl font-medium">
                        All Time Statistics
                     </h2>
                     <div className="flex items-center gap-4 flex-wrap">
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
                  className="font-medium block text-center sm:px-6 py-2 w-full bg-input/10 rounded-lg hover:bg-accent text-sm sm:text-lg transition-all duration-200"
               >
                  Retake
               </Link>
            </div>
         </div>
      </div>
   );
}
