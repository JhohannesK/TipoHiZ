import React from 'react';
import { useRouter } from 'next/router';
import { State, useStoreActions, useStore } from '../store';
import Constants from '../modules/_constants';

const selector = ({ time }: State) => {
   return {
      time: time,
   };
};

const results = () => {
   const router = useRouter();
   const { time } = useStore(selector);
   const { setTime } = useStoreActions();
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
