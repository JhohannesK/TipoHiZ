// TODO: Delete after theme integration
'use client';
import React from 'react';
import { useTheme } from 'next-themes';
// import useTimer from '@/helpers/utils/useTimer';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '../UI/dialog';

export default function ThemeChoose() {
   const { setTheme, theme } = useTheme();
   // const { timer, run, reset, pause, isRunning, isExited } = useTimer(
   //    // () => alert('Count Down/UP finished'),
   //    0,
   //    10
   // );
   const themes = [
      'light',
      'dark',
      'light-orange',
      'dark-orange',
      'light-green',
      'dark-green',
      'dark-gray',
      'midnight-blue',
      'ocean',
      'girly',
      'retro',
      'sunshine',
      'hacktoberfest',
   ];

   //script.js

   return (
      <Dialog>
         <DialogTrigger className="text-input">{theme}</DialogTrigger>
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
               {themes.map((currtheme) => (
                  <button
                     className={`flex items-center justify-center rounded-lg w-full h-12 font-bold text-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${
                        theme === currtheme
                           ? 'bg-foreground text-input  border-input hover:bg-accent hover:text-destructive border-2 transition duration-300 ease-in-out'
                           : 'bg-background text-input border border-input hover:bg-accent hover:text-destructive transition duration-150 ease-in-out'
                     }`}
                     key={currtheme}
                     onClick={() => setTheme(currtheme)}
                  >
                     {currtheme}
                  </button>
               ))}
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
