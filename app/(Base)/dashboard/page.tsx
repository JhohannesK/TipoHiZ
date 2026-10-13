'use client';

import React from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/stat-card';
import { PersonalBests } from '@/components/personal-bests';
import { useSavedResults } from '@/hooks/useSavedResults';
import { summarizeResults } from '@/lib/stats/aggregate';

function wpmText(value: number): string {
   return `${value.toFixed(2)}wpm`;
}

function percentText(value: number): string {
   return `${value.toFixed(1)}%`;
}

function stamp(value: string): string {
   return value.replace('T', ' ').slice(0, 16);
}

export default function DashboardPage() {
   const saved = useSavedResults();
   const summary = summarizeResults(saved);
   const trouble = summary.perKey
      .filter((item) => item.incorrect + item.extra > 0)
      .sort((left, right) => left.accuracy - right.accuracy)
      .slice(0, 12);

   return (
      <div className="pb-8 space-y-8 text-input">
         <div className="flex items-end justify-between gap-4 pt-6">
            <div>
               <h1 className="text-lg font-medium sm:text-xl">Dashboard</h1>
               <p className="text-sm text-input/70">
                  {summary.tests === 1
                     ? '1 saved test'
                     : `${summary.tests} saved tests`}
               </p>
            </div>
            <Link href="/" className="text-sm underline text-input/80">
               Back to test
            </Link>
         </div>
         <div className="flex flex-wrap items-center gap-4">
            <StatCard label="Tests" value={String(summary.tests)} />
            <StatCard label="Average WPM" value={wpmText(summary.averageWpm)} />
            <StatCard
               label="Average raw"
               value={wpmText(summary.averageRawWpm)}
            />
            <StatCard
               label="Average hit rate"
               value={percentText(summary.averageAccuracy)}
            />
            <StatCard
               label="Average consistency"
               value={percentText(summary.averageConsistency)}
            />
         </div>
         <PersonalBests results={saved} />
         <div className="space-y-3">
            <h2 className="text-lg font-medium sm:text-xl">Recent tests</h2>
            {summary.recent.length === 0 ? (
               <p className="text-sm text-input/70">
                  No tests yet. Finish one and it will show up here.
               </p>
            ) : (
               <ul className="space-y-2">
                  {summary.recent.slice(0, 20).map((test) => (
                     <li
                        key={test.id}
                        className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-input/30 px-4 py-3"
                     >
                        <div>
                           <p className="font-medium">{wpmText(test.wpm)}</p>
                           <p className="text-sm text-input/60">
                              {stamp(test.createdAt)} · {test.language} ·{' '}
                              {test.mode} · {test.durationSeconds}s ·{' '}
                              {test.wordCount} words
                           </p>
                        </div>
                        <p className="text-sm">
                           {percentText(test.accuracy)} · raw{' '}
                           {wpmText(test.rawWpm)}
                        </p>
                     </li>
                  ))}
               </ul>
            )}
         </div>
         <div className="space-y-3">
            <h2 className="text-lg font-medium sm:text-xl">Per key</h2>
            {trouble.length === 0 ? (
               <p className="text-sm text-input/70">No missed keys yet.</p>
            ) : (
               <ul className="flex flex-wrap gap-2">
                  {trouble.map((item) => (
                     <li
                        key={item.key}
                        className="rounded-lg border border-input/30 px-3 py-2 text-sm"
                     >
                        <span className="font-medium">{item.key}</span>{' '}
                        <span className="text-input/60">
                           {percentText(item.accuracy)}
                        </span>
                     </li>
                  ))}
               </ul>
            )}
         </div>
      </div>
   );
}
