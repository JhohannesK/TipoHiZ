import { wordStore } from '..';

export const setActiveWord = (activeWord: string) =>
   wordStore.setState({ activeWord });

export const setUserInput = (userInput: string) =>
   wordStore.setState({ userInput });

export const setWordList = (wordList: string[]) => {
   const areNotWords = wordList.some((word) => word.includes(' '));
   let shuffledList = wordList.sort(() => Math.random() - 0.5);
   if (areNotWords) {
      shuffledList = wordList.flatMap((word) => word.split(' '));
   }
   wordStore.setState((state) => ({
      ...state,
      wordList: shuffledList,
      activeWord: shuffledList[0],
      userInput: '',
      typedHistory: [],
   }));
};

export const setCaretRef = (
   caretRef: React.RefObject<HTMLSpanElement> | null
) => {
   wordStore.setState({ caretRef });
};

export const setRef = (
   activeWordRef: React.RefObject<HTMLDivElement> | null
) => {
   wordStore.setState({ activeWordRef });
};

export const setChar = (key: string) => {
   wordStore.setState((state) => ({
      userInput: state.userInput + key,
      nextCharIdx: state.nextCharIdx + 1,
   }));
};

export const setNextChar = () =>
   wordStore.setState((state) => ({
      nextChar: state.activeWord[state.nextCharIdx],
   }));

export const setPrevChar = () =>
   wordStore.setState((state) => ({
      activeWord: state.nextIndex
         ? state.wordList[state.nextIndex - 1]
         : state.wordList[0],
      nextIndex: state.nextIndex ? state.nextIndex - 1 : 0,
   }));

export const setDisabled = (disabled: boolean) =>
   wordStore.setState({ disabled });

export const afterPressingSpace = () => {
   wordStore.setState((state) => ({
      nextIndex: state.nextIndex + 1,
      nextCharIdx: 0,
   }));
   wordStore.setState((state) => ({
      userInput: '',
      typedHistory: [...state.typedHistory, state.userInput],
      activeWord: state.wordList[state.nextIndex],
      caretPos: 0,
   }));
   IncreaseTypedEntries();
};

export const IncreaseTypedEntries = () =>
   wordStore.setState((state) => ({
      typedEntries: state.typedEntries + 1,
   }));

export const setErrorCount = (errorCount: number) =>
   wordStore.setState({ errorCount });
