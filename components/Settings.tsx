'use client';
import React, { useEffect, useState } from 'react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle, DialogTrigger
} from '@/components/UI/dialog';
import { LuSettings } from 'react-icons/lu';

export default function Settings() {

   const [mounted, setMounted] = useState(false); //tracking wether the component is mounted or not

   useEffect(() => {
      setMounted(true);
   }, []);

   if (!mounted) return null;

   return (
      <Dialog>
         <DialogTrigger className="flex items-center justify-center p-2 rounded-xl gap-3 cursor-pointer text-foreground bg-input">
            <LuSettings className="text-background" />
            <p className="text-sm tracking-wide text-background">Settings</p>
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
         </DialogContent>
      </Dialog>
   );
}
