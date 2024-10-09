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

export const accuratePercentage = (
   errorCount: number,
   typedEntries: number
) => {
   if (typedEntries === 0) return 100;
   return Math.round((errorCount / typedEntries) * 100);
};
