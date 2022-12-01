import create from 'zustand';
import Constants from '../modules/_constants';

export interface State {
   disabled: boolean;
   time: number;
   activeWord: number;
   userInput: string;
   actions: {
      setDisabled: (disabled: boolean) => void;
      setTime: (time: any) => void;
      setActiveWord: (activeWord: number) => void;
      setUserInput: (userInput: string) => void;
   };
}

export const useStore = create<State>((set) => ({
   disabled: false,
   activeWord: 0,
   time: Constants.TimeSec,
   userInput: '',

   // Actions
   actions: {
      setDisabled: (disabled: boolean) => set({ disabled }),
      setTime: (time: any) => set({ time }),
      setActiveWord: (activeWord: number) => set({ activeWord }),
      setUserInput: (userInput: string) => set({ userInput }),
      decreaseTime: () => set((state) => ({ time: state.time - 1 })),
   },
}));

export const useStoreActions = () => useStore((state) => state.actions);

// const config = create<Config>((set) => ({
//    // Persist the state in localStorage
//    persist: (name, config) => {
//       const json = localStorage.getItem(name);
//       if (json) set(JSON.parse(json));
//       return config(
//          (state) => localStorage.setItem(name, JSON.stringify(state)),
//          false
//       );
//    },
// }));
