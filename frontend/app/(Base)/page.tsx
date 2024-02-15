import React from 'react';
import TextArea from '@/components/TextArea';
import UserSelectPallete from '@/components/UserSelectPallete';
import ResetTestButton from '@/components/reset-test-button';
import { MdLanguage } from 'react-icons/md';
export default function HomePage() {
   return (
      <div>
         <UserSelectPallete />
         <div className="flex items-center justify-between mt-16 sm:px-10">
            {/* Time display */}
            <div className="text-2xl font-medium font-poppins text-emerald-400">
               {/* <Timer /> */}
            </div>
            <div className="flex items-center justify-center mb-4 tracking-widest lowercase gap-x-3">
               <MdLanguage />
               <p className="cursor-pointer">english</p>
            </div>
         </div>
         <TextArea />
         <ResetTestButton />
      </div>
   );
}
