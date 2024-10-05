'use client';
import React from 'react';
import Link from 'next/link';
import { userConfigStore, wordStore } from '@/store';
import { grossWPM } from '@/helpers/utils/util';

export default function ResultsPage() {
   const { typedEntries } = wordStore.getState();
   const { time } = userConfigStore.getState();
   const wpm = grossWPM(typedEntries, time);
   const accuracy = Math.round((typedEntries / (typedEntries + 10)) * 100);
   const avgSpeed = wpm;

   return (
      <div className="flex flex-col items-start gap-10 mt-20 justify-center text-input">
         <div className="text-start flex flex-col gap-8">
            <p className="text-xl font-semibold">Current Standing</p>
            <p className="text-lg mb-4">Show for statistics: English</p>
         </div>
         <div className="flex gap-8 justify-center">
            <div className="flex flex-col items-center p-4 border-white border-2 rounded-lg shadow-md">
               <h2 className="text-2xl font-bold">{time} sec</h2>
               <p className="text-white">Time</p>
            </div>
            <div className="flex flex-col items-center p-4 border-white border-2 rounded-lg shadow-md">
               <h2 className="text-2xl font-bold">{avgSpeed} WPM</h2>
               <p className="text-white">Avg Speed</p>
            </div>
            <div className="flex flex-col items-center p-4 border-white border-2 rounded-lg shadow-md">
               <h2 className="text-2xl font-bold">{accuracy}%</h2>
               <p className="text-white">Accuracy</p>
            </div>
         </div>
         <Link
            href={'/'}
            className="text-lg px-5 py-3 bg-foreground rounded-lg hover:bg-accent transition-all duration-200"
         >
            Retake
         </Link>
      </div>
   );
}
