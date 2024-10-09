import { userConfigStore, wordStore } from '..';

export const resetStates = () => {
   wordStore.setState({
      disabled: false,
      activeWord: '',
      userInput: '',
      wordList: [],
      typedHistory: [],
      // caretRef: null,
      // activeWordRef: null,
      nextIndex: 0,
      typedEntries: 0,
      errorCount: 0,
   });
};

export const setDefaultTime = (time: number) =>
   userConfigStore.setState({ time });
