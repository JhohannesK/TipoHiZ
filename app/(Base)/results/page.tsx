'use client';
import React from 'react';
import { StatCard } from '@/components/stat-card';
import { PersonalBests } from '@/components/personal-bests';
import { userConfigStore, wordStore } from '@/store';
import Link from 'next/link';
import { formatTime } from '@/lib/utils';
import { calculateStats } from '@/lib/stats/calculate';
import { statsFromResult } from '@/lib/stats/aggregate';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { resetStates } from '@/store/actions/TimeActions';
import { useSavedResults } from '@/hooks/useSavedResults';
import type { TestStats } from '@/lib/stats/types';

const LANGUAGES = ['English', 'Spanish', 'French', 'German'];

function wpmText(value: number): string {
   return `${value.toFixed(2)}wpm`;
}

function percentText(value: number): string {
   return `${value.toFixed(1)}%`;
}

export default function ResultsPage() {
   const time = userConfigStore((state) => state.time);
   const category = userConfigStore((state) => state.category);
   const keystrokeLog = wordStore((state) => state.keystrokeLog);
   const wordList = wordStore((state) => state.wordList);
   const nextIndex = wordStore((state) => state.nextIndex);
   const saved = useSavedResults();

   const liveStats: TestStats | null =
      keystrokeLog.length === 0
         ? null
         : calculateStats({
              log: keystrokeLog,
              words: wordList.slice(0, nextIndex + 1),
              durationMs: time * 1000,
           });
   const savedCurrent = saved[0] ?? null;
   const stats =
      liveStats ??
      (savedCurrent
         ? statsFromResult(savedCurrent)
         : calculateStats({
              log: [],
              words: [],
              durationMs: time * 1000,
           }));
   const duration = liveStats ? time : savedCurrent?.durationSeconds ?? time;

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
                     <StatCard label={category} value={formatTime(duration)} />
                     <StatCard
                        label="Average Speed"
                        value={wpmText(stats.wpm)}
                     />
                     <StatCard
                        label="Total Speed"
                        value={wpmText(stats.rawWpm)}
                     />
                     <StatCard
                        label="Accuracy"
                        value={percentText(stats.accuracy)}
                     />
                     <StatCard
                        label="Consistency"
                        value={percentText(stats.consistency)}
                     />
                  </div>
               </div>
               {stats.typedEntries > 0 && (
                  <div className="space-y-3">
                     <h2 className="text-lg font-medium sm:text-xl">
                        Speed by second
                     </h2>
                     <div className="flex gap-2 overflow-x-auto pb-1">
                        {stats.samples.map((sample) => (
                           <div
                              key={sample.second}
                              className="min-w-14 rounded-lg border border-input/30 px-2 py-2 text-center"
                           >
                              <p className="text-xs text-input/50">
                                 {sample.second + 1}s
                              </p>
                              <p className="text-sm font-medium">
                                 {sample.rawWpm.toFixed(0)}
                              </p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
               <PersonalBests results={saved} />
            </div>
            <div className="flex flex-wrap gap-3 sm:pt-4">
               <div className="max-w-[100px] sm:max-w-[150px]">
                  <Link
                     href={'/'}
                     onClick={() => {
                        resetStates();
                     }}
                     className="block w-full py-2 text-sm font-medium text-center transition-all duration-200 rounded-lg sm:px-6 bg-input/10 hover:bg-accent sm:text-lg"
                  >
                     Retake
                  </Link>
               </div>
               <Link
                  href="/dashboard"
                  className="px-4 py-2 text-sm font-medium rounded-lg sm:text-lg text-input hover:bg-input/10"
               >
                  Dashboard
               </Link>
            </div>
         </div>
      </div>
   );
}
