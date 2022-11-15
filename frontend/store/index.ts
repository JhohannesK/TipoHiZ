import create from 'zustand';
import Constants from '../components/modules/_constants';

export interface State {
   disabled: boolean;
   time: number;
   setDisabled: (disabled: boolean) => void;
   setTime: (time: any) => void;
}

const useStore = create<State>((set) => ({
   disabled: false,
   setDisabled: (disabled: boolean) => set({ disabled }),
   time: Constants.TimeSec,
   setTime: (time: any) => set({ time }),
}));

export default useStore;
