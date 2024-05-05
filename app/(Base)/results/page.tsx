'use client';
import React from 'react';
import Link from 'next/link';
import { userConfigStore, wordStore } from '@/store';
import { grossWPM } from '@/helpers/utils/util';

export default function ResultsPage() {
   const { typedEntries } = wordStore.getState();
   const { time } = userConfigStore.getState();
   const wpm = grossWPM(typedEntries, time);
   console.log('🚀 ~ ResultsPage ~ wpm:', wpm);
   return (
      <div className="flex flex-col items-center justify-center text-input">
         <h1>This is where the results would be displayed</h1>
         <Link href={'/'}>Go back</Link>
         <div>
            <h2 className="text-6xl font-bold">{wpm} WPM</h2>
         </div>
      </div>
   );
}
