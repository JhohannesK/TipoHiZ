import { resetKeystrokeClock } from '../../lib/stats/clock';
import { userConfigStore, wordStore } from '..';

export const resetStates = () => {
   resetKeystrokeClock();
   wordStore.setState({
      disabled: false,
      activeWord: '',
      userInput: '',
      wordList: [],
      typedHistory: [],
      keystrokeLog: [],
      // caretRef: null,
      // activeWordRef: null,
      nextIndex: 0,
      typedEntries: 0,
      errorCount: 0,
   });
};

export const setDefaultTime = (time: number) =>
   userConfigStore.setState({ time });
