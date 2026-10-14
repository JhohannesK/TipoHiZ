import { devtools, persist } from 'zustand/middleware';
import Constants from '../modules/_constants';
import { IuserConfig, MyPersist, WordState } from './@types.';
import { create } from 'zustand';

const devtoolsEnabled = process.env.NODE_ENV === 'development';

export const userConfigStore = create<IuserConfig>()(
   devtools(
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
      ),
      { name: 'userStore', enabled: devtoolsEnabled }
   )
);

export const wordStore = create<WordState>()(
   devtools<WordState>(
      () => ({
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
      }),
      { name: 'wordStore', enabled: devtoolsEnabled }
   )
);

// export const timeStore = create<TimeState>(() => ({
//    timerId: 2,
//    isRunning: false,
//    timer: 120
// }))
