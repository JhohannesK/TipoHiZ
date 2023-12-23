/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

export const useGetStatefromStorage = (store: any, callback: any) => {
   const [state, setState] = React.useState(null);
   const storedValue = store(callback);
   React.useEffect(() => {
      setState(storedValue);
   }, [storedValue]);
   return state;
};

export default useGetStatefromStorage;
