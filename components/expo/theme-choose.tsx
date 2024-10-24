'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { THEMES, THEME_COLORS } from './theme.constant';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '../UI/dialog';

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

   if (status === 'unmounted') return null;

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
               <DialogTitle className="mb-4 text-xl font-semibold text-center text-input">
                  Choose a Theme
               </DialogTitle>
               <DialogDescription className="mb-4 text-center text-accent">
                  Select your preferred theme from the options below.
               </DialogDescription>
            </DialogHeader>
            <div className="flex flex-row flex-wrap justify-center w-full gap-3 p-3 overflow-auto">
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
                        <div className="flex gap-1 px-3 py-1 rounded-full bg-foreground">
                           <span
                              className="w-4 h-4 border rounded-full border-input"
                              style={{ backgroundColor: colors[0] }}
                           />
                           <span
                              className="w-4 h-4 border rounded-full border-input"
                              style={{ backgroundColor: colors[1] }}
                           />
                        </div>
                     </button>
                  );
               })}
            </div>
         </DialogContent>
      </Dialog>
   );
}
