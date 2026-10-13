import Constants from '../modules/_constants';
import { restoreKeystrokeClock } from '../lib/stats/clock';
import { userConfigStore, wordStore } from '../store';
import type { WordState } from '../store/@types.';

export const initialWordState: WordState = {
   disabled: false,
   activeWord: '',
   userInput: '',
   nextChar: '',
   wordList: [],
   caretRef: null,
   activeWordRef: null,
   typedHistory: [],
   nextIndex: 0,
   nextCharIdx: 0,
   typedEntries: 0,
   errorCount: 0,
   keystrokeLog: [],
};

export function resetStores(): void {
   localStorage.clear();
   sessionStorage.clear();
   restoreKeystrokeClock();
   wordStore.setState(initialWordState);
   userConfigStore.setState({
      time: Constants.TimeSec,
      theme: '',
      type: 'default',
      category: 'time',
      sound: false,
      language: 'english',
   });
}
