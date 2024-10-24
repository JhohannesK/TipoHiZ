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
   try {
      // if (localStorage.getItem(key)) return
      const serializedState = JSON.stringify(state);
      localStorage.setItem(key, serializedState);
   } catch (e) {
      console.log(e);
   }
};

export const loadFromLocalStorage = ({ key }: { key: string }) => {
   try {
      const serializedState = localStorage.getItem(key);
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
   const wordsTyped = typedEntries / 5;
   return Math.max((wordsTyped - errorCount) / minutes, 0);
};

export const formatTime = (time: number) => {
   if (time === 60) {
      return '00:60:00';
   }

   const minutes = Math.floor(time / 60);
   const seconds = Math.floor(time % 60);
   const milliseconds = Math.floor((time % 60) / 1000);
   return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
};

export const getCharClass = (isCorrect: boolean | null) => {
   if (isCorrect === null) return '';
   return isCorrect ? 'text-correct_char' : 'text-wrong_char';
};
