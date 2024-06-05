'use client';
import React from 'react';
import Link from 'next/link';
import { userConfigStore, wordStore } from '@/store';
import { grossWPM } from '@/helpers/utils/util';

export default function ResultsPage() {
   const { typedEntries } = wordStore.getState();
   const { time, category } = userConfigStore.getState();
   const wpm = grossWPM(typedEntries, time);

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
         <div className="text-center">
            <h2 className="text-6xl font-bold">Test Type</h2>
            <p>{category + ' ' + time}</p>
            <p>English</p>
         </div>
      </div>
   );
}
