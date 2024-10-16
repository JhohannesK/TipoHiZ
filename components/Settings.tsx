'use client';
import React, { useEffect, useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from '@/components/UI/dialog';
import { LuSettings, LuVolume2, LuVolumeX } from 'react-icons/lu';
import { useTheme } from 'next-themes';
import { userConfigStore } from '@/store';
import { toggleSound } from '@/store/actions/ConfigActions';
import { THEMES } from '@/components/expo/theme.constant';

export default function Settings() {
   const [mounted, setMounted] = useState(false); //tracking whether the component is mounted or not
   const { sound } = userConfigStore();
   const { setTheme, theme } = useTheme();

   const handleSound = () => {
      const typingSound = new Audio('/modules/AudioFiles/type.mp3');
      typingSound.volume = sound ? 0 : 0.1;
      typingSound.play();
      toggleSound();
   };

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) return null;

   return (
      <Dialog>
         <DialogTrigger className="flex items-center justify-center p-2 rounded-xl gap-3 cursor-pointer text-background bg-input">
            <LuSettings />
         </DialogTrigger>
         <DialogContent className="max-w-[400px] rounded-xl shadow-lg p-6 bg-background border border-gray-300 h-[600px] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-xl font-semibold text-center mb-4 text-input">
                  Settings
               </DialogTitle>
               <DialogDescription className="text-accent mb-4 text-center">
                  Select your preferred settings.
               </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center text-input">
               <div className="flex  gap-2 mb-4">
                  <span>Sound:</span>
                  <button className="outline-none" onClick={handleSound}>
                     {sound ? <LuVolume2 /> : <LuVolumeX />}
                  </button>
               </div>
               <div className="flex gap-2 mb-4">
                  <span>Language:</span>
                  <select className="cursor-pointer bg-background">
                     <option value="english">English</option>
                     <option value="spanish">Spanish</option>
                     <option value="french">French</option>
                     <option value="german">German</option>
                  </select>
               </div>
               <div className="flex gap-2 mb-4">
                  <span>Theme:</span>
               </div>
               <div className="flex flex-row flex-wrap justify-center gap-3 p-3 w-full overflow-auto">
                  {THEMES.map((currtheme) => (
                     <button
                        className={`flex items-center justify-center rounded-lg w-full h-12 font-bold text-sm transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none ${
                           theme === currtheme
                              ? 'bg-foreground text-input border-input hover:bg-accent hover:text-destructive border-2 transition duration-300 ease-in-out'
                              : 'bg-background text-input border border-input hover:bg-accent hover:text-destructive transition duration-150 ease-in-out'
                        }`}
                        key={currtheme}
                        onClick={() => setTheme(currtheme)}
                     >
                        {currtheme}
                     </button>
                  ))}
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
