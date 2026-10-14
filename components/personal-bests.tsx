import React from 'react';
import { summarizeResults } from '@/lib/stats/aggregate';
import type { SavedTestResult } from '@/lib/stats/types';

function metric(value: number | null, digits: number, suffix: string): string {
   if (value === null) return 'n/a';
   return `${value.toFixed(digits)}${suffix}`;
}

export function PersonalBests({
   results,
}: {
   results: readonly SavedTestResult[];
}) {
   const summary = summarizeResults(results);

   return (
      <div className="space-y-4">
         <h2 className="text-lg font-medium sm:text-xl">Personal Bests</h2>
         {summary.tests === 0 ? (
            <p className="text-sm text-input/70">
               Finish a test to start a history.
            </p>
         ) : (
            <dl className="flex flex-wrap gap-4">
               <div className="rounded-lg border border-input/30 px-4 py-2 text-center sm:px-10">
                  <dt className="text-sm text-input/50">Best speed</dt>
                  <dd className="text-lg font-medium sm:text-xl">
                     {metric(summary.personalBests.wpm, 2, 'wpm')}
                  </dd>
               </div>
               <div className="rounded-lg border border-input/30 px-4 py-2 text-center sm:px-10">
                  <dt className="text-sm text-input/50">Best raw</dt>
                  <dd className="text-lg font-medium sm:text-xl">
                     {metric(summary.personalBests.rawWpm, 2, 'wpm')}
                  </dd>
               </div>
               <div className="rounded-lg border border-input/30 px-4 py-2 text-center sm:px-10">
                  <dt className="text-sm text-input/50">Best accuracy</dt>
                  <dd className="text-lg font-medium sm:text-xl">
                     {metric(summary.personalBests.accuracy, 1, '%')}
                  </dd>
               </div>
               <div className="rounded-lg border border-input/30 px-4 py-2 text-center sm:px-10">
                  <dt className="text-sm text-input/50">Best consistency</dt>
                  <dd className="text-lg font-medium sm:text-xl">
                     {metric(summary.personalBests.consistency, 1, '%')}
                  </dd>
               </div>
            </dl>
         )}
      </div>
   );
}
