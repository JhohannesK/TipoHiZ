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
