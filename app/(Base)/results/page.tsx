'use client';
import React from 'react';
import Link from 'next/link';
import { userConfigStore, wordStore } from '@/store';
import { calculateAccuracy, grossWPM } from '@/helpers/utils/util';

export default function ResultsPage() {
   const { typedEntries, correctEntries, incorrectEntries } =
      wordStore.getState();
   const { time, category } = userConfigStore.getState();
   const wpm = grossWPM(typedEntries, time);
   const accuracy = calculateAccuracy(correctEntries, incorrectEntries);
   return (
      <div className="flex flex-col items-center gap-10 justify-center text-input">
         <Link
            href={'/'}
            className="text-lg px-5 py-3 bg-foreground rounded-lg hover:bg-accent transition-all duration-200"
         >
            Retake
         </Link>
         <div>
            <h2 className="text-6xl font-bold">{time} Time</h2>
         </div>
         <div>
            <h2 className="text-6xl font-bold">{wpm} WPM</h2>
         </div>
         <div>
            <h2 className="text-6xl font-bold">Accuracy: {accuracy}%</h2>
         </div>
         <div className="text-center">
            <h2 className="text-6xl font-bold">Test Type</h2>
            <p>{category + ' ' + time}</p>
            <p>English</p>
         </div>
      </div>
   );
}
