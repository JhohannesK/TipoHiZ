import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...className: ClassValue[]) {
   return twMerge(clsx(className));
}

export const saveToLocalStorage = <T>({
   state,
   key,
}: {
   key: string;
   state: T;
}) => {
   if (typeof window === 'undefined') return;
   try {
      // if (localStorage.getItem(key)) return
      const serializedState = JSON.stringify(state);
      window.localStorage.setItem(key, serializedState);
   } catch (e) {
      console.log(e);
   }
};

export const loadFromLocalStorage = ({ key }: { key: string }) => {
   if (typeof window === 'undefined') return undefined;
   try {
      const serializedState = window.localStorage.getItem(key);
      if (serializedState === null) return false;
      return JSON.parse(serializedState);
   } catch (e) {
      console.log(e);
      return undefined;
   }
};

export const grossWPM = (typedEntries: number, time: number) => {
   return ((typedEntries / 5) * 60) / time;
};

export const accurateWPM = (
   errorCount: number,
   typedEntries: number,
   time: number
) => {
   const minutes = time / 60;
   // Subtract errors from character count before converting to words
   const adjustedCharCount = Math.max(typedEntries - errorCount, 0);
   const adjustedWordCount = adjustedCharCount / 5;
   return adjustedWordCount / minutes;
};

export const calculateAccuracy = (errorCount: number, typedEntries: number) => {
   if (typedEntries === 0) return 100;
   const accuracy = Math.max(
      0,
      ((typedEntries - errorCount) / typedEntries) * 100
   );
   return Math.min(accuracy, 100);
};

export const formatTime = (time: number) => {
   const totalSeconds = Math.max(0, Math.floor(time));
   const hours = Math.floor(totalSeconds / 3600);
   const minutes = Math.floor((totalSeconds % 3600) / 60);
   const seconds = totalSeconds % 60;

   return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
