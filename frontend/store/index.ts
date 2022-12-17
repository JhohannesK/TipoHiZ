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

export const wordStore = create<State>(() => ({
   disabled: false,
   activeWord: '',
   userInput: '',
   timerId: 2,
   wordList: [],
   typedHistory: [],
   caretRef: null,
   activeWordRef: null,
   nextIndex: 0,
}));
