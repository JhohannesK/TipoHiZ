// TODO: Delete after theme integration
// ** This is just to show how it works
import React from 'react';
import ThemeChoose from '@/components/expo/theme-choose';

export default function Page() {
   return (
      <>
         <div className="flex items-center justify-center">
            <h1 className="font-bold text-4xl text-foreground">Theme Expo</h1>
         </div>
         <div className="flex items-center justify-center text-foreground">
            <div className="w-80 rounded m-11 p-4 border-2 border-border bg-card">
               <h2 className="font-bold text-xl">Payment Method</h2>
               <p className="text-sm">
                  Add a new payment method to your account
               </p>
               <button
                  type="submit"
                  className="flex font-bold items-center justify-center bg-primary w-full rounded py-2 mt-5 text-background"
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
