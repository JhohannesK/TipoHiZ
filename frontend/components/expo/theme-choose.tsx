// TODO: Delete after theme integration
'use client';

import { useTheme } from 'next-themes';

export default function ThemeChoose() {
   const { setTheme, theme } = useTheme();
   const themes = [
      'light',
      'dark',
      'light-orange',
      'dark-orange',
      'light-green',
      'dark-green',
   ];
   return (
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
   );
}
