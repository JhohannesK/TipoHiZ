import { persist } from 'zustand/middleware';
import Constants from '../modules/_constants';
import { IuserConfig, MyPersist, WordState } from './@types.';
import { create } from 'zustand';

export const userConfigStore = create<IuserConfig>()(
   (persist as unknown as MyPersist)(
      () => ({
         time: Constants.TimeSec, // default: 30
         theme: '',
         type: 'default', // 'punctuation', 'numbers', 'code'
         category: 'time', // 'time', 'words'
         sound: false,
         language: 'english', // default language
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
   errorCount: 0,
   keystrokeLog: [],
}));

// export const timeStore = create<TimeState>(() => ({
//    timerId: 2,
//    isRunning: false,
//    timer: 120
// }))
