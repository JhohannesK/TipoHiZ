import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// ref: https://stackoverflow.com/questions/63984376/how-can-i-implement-this-countdown-timer-in-react-with-hooks
const useTimer = (
   lowerBound: number,
   upperBound: number,
   countDown: boolean = true,
   runOnStart: boolean = false,
   exitCallback?: (() => void) | null
) => {
   const initialTimer = countDown ? upperBound : lowerBound;
   const millisecond = useRef(initialTimer * 1000);
   const previous = useRef(millisecond.current);
   const [timer, setTimer] = useState(initialTimer);
   const [isRunning, setIsRunning] = useState(runOnStart);
   const [isExited, setIsExited] = useState(false);
   const router = useRouter();

   const run = () => {
      setIsRunning(true);
   };

   const pause = () => {
      setIsRunning(false);
   };

   const reset = () => {
      millisecond.current = initialTimer * 1000;
      previous.current = millisecond.current;
      setTimer(initialTimer);
      setIsRunning(runOnStart);
      setIsExited(false);
   };

   useEffect(() => {
      if (
         !isRunning ||
         (countDown && millisecond.current <= lowerBound * 1000) ||
         (!countDown && millisecond.current >= upperBound * 1000)
      )
         return;

      const currentMillisecond = millisecond.current;
      let currentTimeStamp: number, handle: number;

      const step = (timeStampInMillesconds: number) => {
         if (currentTimeStamp === undefined)
            currentTimeStamp = timeStampInMillesconds;

         const elapsedTime = timeStampInMillesconds - currentTimeStamp;
         millisecond.current = countDown
            ? currentMillisecond - elapsedTime
            : currentMillisecond + elapsedTime;

         if (countDown && millisecond.current <= lowerBound * 1000) {
            if (exitCallback !== null) {
               setIsExited(true);
               // exitCallback();
               router.push('/results');
            }
            setTimer(lowerBound);
            cancelAnimationFrame(handle);
         } else if (!countDown && millisecond.current >= upperBound * 1000) {
            if (exitCallback !== null) {
               setIsExited(true);
               // exitCallback();
               router.push('/results');
            }
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

   return { timer, isRunning, run, pause, reset, isExited };
};

export default useTimer;
