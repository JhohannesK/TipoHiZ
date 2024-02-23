import React from 'react';
import Link from 'next/link';

export default function ResultsPage() {
   // TODO: Call this function after click -> cannot be done here -> This is a server component
   // setDefaultTime(Constants.TimeSec);
   return (
      <div className="flex items-center justify-center text-input">
         <h1>This is where the results would be displayed</h1>
         <Link href={'/'}>Go back</Link>
      </div>
   );
}
