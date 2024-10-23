// TODO: Delete after theme integration
'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
// import useTimer from '@/helpers/utils/useTimer';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '../ui/dialog';
import { THEMES, THEME_COLORS } from './theme.constant';

export default function ThemeChoose() {
   const { setTheme, theme, resolvedTheme } = useTheme();

   // 'unmounted' - component just rendered;
   // 'mounted' - component has mounted and has been hydrated, and is dialog closed state;
   // 'dialogOpen' - theme selection dialog is open
   const [status, setStatus] = useState<'unmounted' | 'mounted' | 'dialogOpen'>(
      'unmounted'
   );

   useEffect(() => {
      setStatus('mounted');
   }, []);
   // const { timer, run, reset, pause, isRunning, isExited } = useTimer(
   //    // () => alert('Count Down/UP finished'),
   //    0,
   //    10
   // );

   if (status === 'unmounted') return null;

   //script.js

   return (
      <Dialog
         open={status === 'dialogOpen'}
         onOpenChange={(open) => setStatus(open ? 'dialogOpen' : 'mounted')}
      >
         <DialogTrigger className="text-input">
            {theme || resolvedTheme}
         </DialogTrigger>
         <DialogContent className="max-w-[400px] rounded-xl shadow-lg p-6 bg-background border border-gray-300 h-[600px] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-xl font-semibold text-center mb-4 text-input">
                  Choose a Theme
               </DialogTitle>
               <DialogDescription className="text-accent mb-4 text-center">
                  Select your preferred theme from the options below.
               </DialogDescription>
            </DialogHeader>
            <div className="flex flex-row flex-wrap justify-center gap-3 p-3 w-full overflow-auto">
               {THEMES.map((currtheme) => {
                  const colors = THEME_COLORS[currtheme];
                  return (
                     <button
                        className={`flex items-center justify-between px-3 rounded-lg w-full h-12 font-bold text-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${
                           theme === currtheme
                              ? 'bg-foreground text-input  border-input hover:bg-accent hover:text-destructive border-2 transition duration-300 ease-in-out'
                              : 'bg-background text-input border border-input hover:bg-accent hover:text-destructive transition duration-150 ease-in-out'
                        }`}
                        key={currtheme}
                        onClick={() => {
                           setTheme(currtheme);
                           setStatus('mounted');
                        }}
                     >
                        {currtheme}
                        <div className="flex gap-1 px-3 py-1 bg-foreground rounded-full">
                           <span
                              className="w-4 h-4 rounded-full border border-input"
                              style={{ backgroundColor: colors[0] }}
                           />
                           <span
                              className="w-4 h-4 rounded-full border border-input"
                              style={{ backgroundColor: colors[1] }}
                           />
                        </div>
                     </button>
                  );
               })}
            </div>
         </DialogContent>
      </Dialog>
      /* <div className="flex flex-col items-center justify-center mt-10">
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
         </div> */
   );
}
