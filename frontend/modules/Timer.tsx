import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useRef } from 'react';
import { State, useStore, useStoreActions } from '../store';

export const startTimeCountDown = (
   exit: VoidFunction,
   update: (time: number) => void,
   interval: any,
   threshold: number
) => {
   const start = Date.now();

   interval.current = setInterval(() => {
      const now = Date.now();
      const delta = Math.floor((now - start) / 1000);

      if (delta >= threshold) {
         exit();
         clearInterval(interval.current);
      } else {
         update(delta);
      }
   }, 1000);
};

const selector = ({
   disabled,
   time,
}: State) => {
   return {
      disabledInput: disabled,
      time,
   };
};

const Timer = memo(({ input }: { input: any }) => {
   const router = useRouter();

   const { time } = useStore(selector);
   const {setTime, setActiveWord, setUserInput} = useStoreActions()
   const threshold = time;

   const exit = () => {
      setActiveWord(0);
      setUserInput('');
      router.push('/results');
   };

   const update = (delta: number) => {
      setTime(threshold - delta);
   };
   const intRef = useRef();

   const startCountDown = useCallback(() => {
      startTimeCountDown(exit, update, intRef, threshold);
      if (input.current) {
         input.current.removeEventListener('keydown', startCountDown);
      }
   }, []);

   //  Serves the selected paragraph to text of useState
   useEffect(() => {
      if (input.current) {
         input.current.addEventListener('keydown', startCountDown);
      }
      return () => {
         setTime(threshold);
      };
   }, []);

   return <div>{time}</div>;
});

export default Timer;
