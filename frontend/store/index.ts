import create from 'zustand';
import { persist } from 'zustand/middleware';
import Constants from '../modules/_constants';
import { IuserConfig, MyPersist, State } from './@types.';

export const userConfigStore = create<IuserConfig>()(
   (persist as any as MyPersist)(
      () => ({
         time: Constants.TimeSec,
         theme: '',
         type: 'default', // 'punctuation', 'numbers', 'code'
         category: 'time', // 'time', 'words'
      }),
      {
         name: 'userConfig',
      }
   )
);

export const useStore = create<State>(() => ({
   disabled: false,
   activeWord: 0,
   userInput: '',
   timerId: 2,
}));
