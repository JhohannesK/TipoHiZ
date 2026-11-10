import { useEffect, useRef, useState } from 'react';

const useElapsed = () => {
   const [elapsed, setElapsed] = useState(0);
   const [running, setRunning] = useState(false);
   const startedAt = useRef<number | null>(null);

   const run = () => {
      setRunning(true);
   };

   const reset = () => {
      startedAt.current = null;
      setElapsed(0);
      setRunning(false);
   };

   useEffect(() => {
      if (!running) return;

      let handle = 0;
      const step = (now: number) => {
         if (startedAt.current === null) startedAt.current = now;
         const seconds = Math.floor((now - startedAt.current) / 1000);
         setElapsed((current) => (current === seconds ? current : seconds));
         handle = window.requestAnimationFrame(step);
      };

      handle = window.requestAnimationFrame(step);
      return () => {
         window.cancelAnimationFrame(handle);
      };
   }, [running]);

   return { elapsed, running, run, reset };
};

export default useElapsed;
