// TODO: Delete after theme integration
// ** This is just to show how it works
import React from 'react';
import ThemeChoose from '@/components/expo/theme-choose';

export default function Page() {
   return (
      <>
         <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold text-input">Theme Expo</h1>
         </div>
         <div className="flex items-center justify-center text-input">
            <div className="p-4 border-2 rounded w-80 m-11 border-foreground bg-card">
               <h2 className="text-xl font-bold">Payment Method</h2>
               <p className="text-sm">
                  Add a new payment method to your account
               </p>
               <button
                  type="submit"
                  className="flex items-center justify-center w-full py-2 mt-5 font-bold rounded bg-cursor text-background"
               >
                  <span>submit</span>
               </button>
            </div>
         </div>

         <div>
            <ThemeChoose />
         </div>
      </>
   );
}
