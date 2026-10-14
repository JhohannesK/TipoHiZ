'use client';
import React, { useEffect } from 'react';
import { StatCard } from '@/components/stat-card';
import { PersonalBests } from '@/components/personal-bests';
import { ResultsChart } from '@/components/results-chart';
import { userConfigStore, wordStore } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatTime } from '@/lib/utils';
import { displayedResult, formatTestMode } from '@/lib/results/display';
import { isRestartBlockedTarget, tabRestarts } from '@/lib/results/restart-key';
import { resetStates } from '@/store/actions/TimeActions';
import { useSavedResults } from '@/hooks/useSavedResults';

function wpmText(value: number): string {
   return `${value.toFixed(2)}wpm`;
}

function percentText(value: number): string {
   return `${value.toFixed(1)}%`;
}

function countText(value: number): string {
   return Number.isFinite(value) ? String(value) : '0';
}

export default function ResultsPage() {
   const router = useRouter();
   const time = userConfigStore((state) => state.time);
   const category = userConfigStore((state) => state.category);
   const type = userConfigStore((state) => state.type);
   const language = userConfigStore((state) => state.language);
   const keystrokeLog = wordStore((state) => state.keystrokeLog);
   const wordList = wordStore((state) => state.wordList);
   const saved = useSavedResults();
   const display = displayedResult({
      liveLog: keystrokeLog,
      liveWords: wordList,
      config: { time, category, type, language },
      saved: saved[0] ?? null,
   });
   const { stats } = display;

   useEffect(() => {
      function onKeyDown(event: KeyboardEvent) {
         if (
            !tabRestarts({
               key: event.key,
               shiftKey: event.shiftKey,
               altKey: event.altKey,
               metaKey: event.metaKey,
               ctrlKey: event.ctrlKey,
               targetInteractive: isRestartBlockedTarget(event.target),
            })
         ) {
            return;
         }

         event.preventDefault();
         resetStates();
         router.push('/');
      }

      document.addEventListener('keydown', onKeyDown);
      return () => {
         document.removeEventListener('keydown', onKeyDown);
      };
   }, [router]);

   return (
      <div className="pb-8 text-input">
         <h1 className="sr-only">Game Results page</h1>
         <div className="space-y-8 pt-6">
            <div className="space-y-6">
               <h2 className="text-lg font-medium sm:text-xl">
                  Current Results
               </h2>
               <div className="grid grid-cols-1 items-end gap-6 sm:grid-cols-2">
                  <StatCard emphasis label="wpm" value={wpmText(stats.wpm)} />
                  <StatCard
                     emphasis
                     label="accuracy"
                     value={percentText(stats.accuracy)}
                  />
               </div>
               {stats.typedEntries > 0 && (
                  <div className="space-y-3">
                     <h2 className="text-lg font-medium sm:text-xl">
                        Speed by second
                     </h2>
                     <ResultsChart samples={stats.samples} />
                  </div>
               )}
               <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  <StatCard label="raw" value={wpmText(stats.rawWpm)} />
                  <StatCard
                     label="consistency"
                     value={percentText(stats.consistency)}
                  />
                  <StatCard
                     label="characters"
                     value={`${countText(stats.correct)}/${countText(
                        stats.incorrect
                     )}/${countText(stats.extra)}/${countText(stats.missed)}`}
                     detail="correct / incorrect / extra / missed"
                  />
                  <StatCard
                     label={display.category}
                     value={formatTime(display.durationSeconds)}
                  />
                  <StatCard
                     className="col-span-2 sm:col-span-1"
                     label="mode"
                     value={formatTestMode(display)}
                  />
               </div>
               <PersonalBests results={saved} />
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:pt-4">
               <div className="max-w-[100px] sm:max-w-[150px]">
                  <Link
                     href={'/'}
                     onClick={() => {
                        resetStates();
                     }}
                     className="block w-full rounded-lg bg-input/10 py-2 text-center text-sm font-medium transition-all duration-200 hover:bg-accent sm:px-6 sm:text-lg"
                  >
                     Retake
                  </Link>
               </div>
               <Link
                  href="/dashboard"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-input hover:bg-input/10 sm:text-lg"
               >
                  Dashboard
               </Link>
               <p className="text-sm text-input/70">Tab restarts the test.</p>
            </div>
         </div>
      </div>
   );
}
