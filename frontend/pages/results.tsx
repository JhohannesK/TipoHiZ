import React from 'react';
import { useRouter } from 'next/router';
import useStore, { State } from '../store';
import Constants from '../components/modules/_constants';

const selector = ({ time, setTime }: State) => {
   return {
      time: time,
      setTimer: setTime,
   };
};

const results = () => {
   const router = useRouter();
   const { time, setTimer } = useStore(selector);
   return (
      <div className="">
         This is where the results would be displayed
         <button
            onClick={() => {
               router.push('/');
               setTimer(Constants.TimeSec);
            }}
         >
            Go back
         </button>
      </div>
   );
};

export default results;
