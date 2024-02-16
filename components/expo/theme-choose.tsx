// TODO: Delete after theme integration
'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import useTimer from '@/helpers/utils/useTimer';

export default function ThemeChoose() {
   const { setTheme, theme } = useTheme();
   const { timer, run, reset, pause, isRunning, isExited } = useTimer(
      () => alert('Count Down/UP finished'),
      0,
      10
   );
   const themes = [
      'light',
      'dark',
      'light-orange',
      'dark-orange',
      'light-green',
      'dark-green',
   ];
   return (
      <>
         <div className="flex justify-center space-x-5">
            {themes.map((currtheme) => (
               <button
                  className={`rounded w-28 h-14 font-bold text-input bg-background hover:bg-accent ${
                     theme === currtheme
                        ? 'border-foreground border-2'
                        : 'border-destructive border'
                  }`}
                  key={currtheme}
                  onClick={() => setTheme(currtheme)}
               >
                  {currtheme}
               </button>
            ))}
         </div>

         <div className="flex flex-col items-center justify-center mt-10">
            <div className="font-extrabold text-9xl text-input">{timer}</div>
            <div className="flex flex-col">
               <button
                  className={`flex font-bold items-center justify-center rounded py-2 mt-5 text-input w-48 ${
                     isRunning || isExited ? 'bg-background' : 'bg-foreground'
                  }`}
                  onClick={run}
                  disabled={isRunning || isExited}
               >
                  start
               </button>
               <button
                  className={`flex font-bold items-center justify-center rounded py-2 mt-5 text-background w-48 ${
                     isRunning || isExited ? 'bg-background' : 'bg-foreground'
                  }`}
                  onClick={pause}
                  disabled={!isRunning || isExited}
               >
                  pause
               </button>
               <button
                  className="flex items-center justify-center w-48 py-2 mt-5 font-bold rounded bg-destructive text-background"
                  onClick={reset}
               >
                  reset
               </button>
            </div>
         </div>
      </>
   );
}
