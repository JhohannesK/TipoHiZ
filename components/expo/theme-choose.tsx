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
   ];
   return (
      <>
         <Dialog>
            <DialogTrigger className="text-input">{theme}</DialogTrigger>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle className="text-input">
                     Choose a theme
                  </DialogTitle>
                  <DialogDescription>
                     {/* This action cannot be undone. This will permanently delete
                     your account and remove your data from our servers. */}
                     <div className="flex flex-col justify-center gap-3">
                        {themes.map((currtheme) => (
                           <button
                              className={`rounded w-full h-14 font-bold text-input bg-background hover:bg-foreground ${
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
                  </DialogDescription>
               </DialogHeader>
            </DialogContent>
         </Dialog>

         {/* <div className="flex flex-col items-center justify-center mt-10">
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
         </div> */}
      </>
   );
}
