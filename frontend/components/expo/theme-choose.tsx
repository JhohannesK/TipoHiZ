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
                  className={`rounded w-28 h-14 font-bold text-foreground bg-card hover:bg-accent ${
                     theme === currtheme
                        ? 'border-primary border-2'
                        : 'border-border border'
                  }`}
                  key={currtheme}
                  onClick={() => setTheme(currtheme)}
               >
                  {currtheme}
               </button>
            ))}
         </div>

         <div className="flex items-center justify-center mt-10 flex-col">
            <div className="font-extrabold text-9xl text-foreground">
               {timer}
            </div>
            <div className="flex flex-col">
               <button
                  className={`flex font-bold items-center justify-center rounded py-2 mt-5 text-background w-48 ${
                     isRunning || isExited
                        ? 'bg-muted-foreground'
                        : 'bg-primary'
                  }`}
                  onClick={run}
                  disabled={isRunning || isExited}
               >
                  start
               </button>
               <button
                  className={`flex font-bold items-center justify-center rounded py-2 mt-5 text-background w-48 ${
                     !isRunning || isExited
                        ? 'bg-muted-foreground'
                        : 'bg-primary'
                  }`}
                  onClick={pause}
                  disabled={!isRunning || isExited}
               >
                  pause
               </button>
               <button
                  className="flex font-bold items-center justify-center bg-primary rounded py-2 mt-5 text-background w-48"
                  onClick={reset}
               >
                  reset
               </button>
            </div>
         </div>
      </>
   );
}
