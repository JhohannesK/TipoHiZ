import React from 'react';
import { useRouter } from 'next/router';

const results = () => {
   const router = useRouter();
   return (
      <div className="">
         This is where the results would be displayed
         <button onClick={() => router.push('/')}>Go back</button>
      </div>
   );
};

export default results;
