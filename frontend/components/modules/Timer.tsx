import { useRouter } from 'next/router';
import { useCallback, useRef, useState } from 'react';
import useStore from '../../store';

export const startTimeCountDown = useCallback(() => {
   const router = useRouter();

   const disabledInput = useStore((state) => state.setDisabled);
   const timer = useStore((state) => state.time);
   const setTimer = useStore((state) => state.setTime);
   // For Countdown

   if (timer === 0) {
      router.push('/results');
   }

   const inputRef = useRef<HTMLInputElement>();

   if (inputRef.current) {
      inputRef.current.removeEventListener('keydown', startTimeCountDown);
   }
   let timeInterval = setInterval(() => {
      setTimer((preCount: number) => {
         // Timer stops when it gets to zero
         if (preCount === 1) {
            clearInterval(timeInterval);
            disabledInput(true);
         }
         return preCount - 1;
      });
   }, 1000);
}, []);
