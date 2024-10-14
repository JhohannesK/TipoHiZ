'use client';
import React, { useEffect, useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle, DialogTrigger
} from '@/components/UI/dialog';
import { LuSettings, LuVolume2, LuVolumeX } from 'react-icons/lu';
import ThemeChoose from '@/components/expo/theme-choose';
import { useSettings } from '@/components/UI/settings-context';

export default function Settings() {

   const [mounted, setMounted] = useState(false); //tracking whether the component is mounted or not
   const { sound, toggleSound } = useSettings();

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
               <div className="flex gap-2 mb-4">
                  <span>Theme:</span>
                  <ThemeChoose />
               </div>
               <div className="flex  gap-2 mb-4">
                  <span>Sound:</span>
                  <button className="outline-none" onClick={toggleSound}>
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
            </div>
         </DialogContent>
      </Dialog>
   );
}
