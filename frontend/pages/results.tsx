import React from 'react';
import { useRouter } from 'next/router';
import { userConfigStore } from '../store';
import Constants from '../modules/_constants';
import { IuserConfig } from '../store/@types.';
import { setTime } from '../store/actions/ConfigActions';

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
