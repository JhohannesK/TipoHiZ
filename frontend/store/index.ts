import create from 'zustand';
import Constants from '../components/modules/_constants';

export interface State {
   disabled: boolean;
   time: number;
   setDisabled: (disabled: boolean) => void;
   setTime: (time: any) => void;
   activeWord: number;
   setActiveWord: (activeWord: number) => void;
   userInput: string;
   setUserInput: (userInput: string) => void;
}

const useStore = create<State>((set) => ({
   disabled: false,
   setDisabled: (disabled: boolean) => set({ disabled }),
   time: Constants.TimeSec,
   setTime: (time: any) => set({ time }),
   activeWord: 0,
   setActiveWord: (activeWord: number) => set({ activeWord }),
   userInput: '',
   setUserInput: (userInput: string) => set({ userInput }),
}));

export default useStore;
