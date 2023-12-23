import React from 'react';
import { useRouter } from 'next/router';
import Constants from '../modules/_constants';
import { setTime } from '../store/actions/TimeActions';

const results = () => {
   const router = useRouter();
   return (
      <div className="">
         This is where the results would be displayed
         <button
            onClick={() => {
               router.push('/');
               setTime(Constants.TimeSec);
            }}
         >
            Go back
         </button>
      </div>
   );
};

export default results;
