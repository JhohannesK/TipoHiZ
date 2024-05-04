import { persist } from 'zustand/middleware';
import Constants from '../modules/_constants';
import { IuserConfig, MyPersist, WordState } from './@types.';
import create from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

export const userConfigStore = create<IuserConfig>()(
   (persist as unknown as MyPersist)(
      () => ({
         time: Constants.TimeSec, // default: 60
         theme: '',
         type: 'default', // 'punctuation', 'numbers', 'code'
         category: 'time', // 'time', 'words'
      }),
      {
         name: 'userConfig',
      }
   )
);

export const wordStore = create<WordState>(() => ({
   disabled: false,
   activeWord: '',
   userInput: '',
   nextChar: '',
   wordList: [],
   typedHistory: [],
   caretRef: null,
   activeWordRef: null,
   nextIndex: 0,
   caretPos: 0,
   nextCharIdx: 0,
   typedEntries: 0,
}));

// export const timeStore = create<TimeState>(() => ({
//    timerId: 2,
//    isRunning: false,
//    timer: 120
// }))

if (process.env.NODE_ENV === 'development') {
   mountStoreDevtool('userStore', userConfigStore);
   mountStoreDevtool('wordStore', wordStore);
}
