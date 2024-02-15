import React, { useEffect, useRef, useState } from 'react';

// https://stackoverflow.com/questions/63984376/how-can-i-implement-this-countdown-timer-in-react-with-hooks
const useTimer = (
   //  exitCallback: Function | VoidFunction,
   lowerBound: number,
   upperBound: number,
   runOnStart: boolean = false,
   countDown: boolean = true
) => {
   // a bit of house-keeping here

   const initialTimer = countDown ? upperBound : lowerBound;
   const millisecond = useRef(initialTimer * 1000);
   const previous = useRef(millisecond);
   const [timer, setTimer] = useState(initialTimer);
   const [isRunning, setIsRunning] = useState(runOnStart);

   useEffect(() => {
      if (
         !isRunning ||
         (countDown && millisecond.current <= lowerBound * 1000) ||
         (!countDown && millisecond.current >= upperBound * 1000)
      ) {
         return;
      }

      let currentMillisecond = millisecond.current;
      let currentTimeStamp: number, handle: number;

      const step = (timeStampInMillesconds: number) => {
         if (currentTimeStamp === undefined)
            currentTimeStamp = timeStampInMillesconds;

         const elapsedTime = timeStampInMillesconds - currentTimeStamp;
         millisecond.current = countDown
            ? currentMillisecond - elapsedTime
            : currentMillisecond + elapsedTime;

         if (countDown && millisecond.current <= lowerBound * 1000) {
            setTimer(lowerBound);
            cancelAnimationFrame(handle);
         } else if (!countDown && millisecond.current >= upperBound * 1000) {
            setTimer(upperBound);
            cancelAnimationFrame(handle);
         } else {
            const seconds = Math.floor(millisecond.current / 1000);
            const isUpdate = seconds !== Math.floor(previous.current / 1000);
            previous.current = millisecond.current;

            if (isUpdate) {
               setTimer(seconds);
            }

            if (isRunning) {
               handle = window.requestAnimationFrame(step);
            }
         }
      };
      handle = window.requestAnimationFrame(step);
      return () => {
         cancelAnimationFrame(handle);
      };
   }, [isRunning]);

   return { timer, isRunning, setIsRunning };
};

export default useTimer;
