import { userConfigStore, wordStore } from "..";

export const resetTest = () => {
   wordStore.setState({
      disabled: false,
      activeWord: '',
      userInput: '',
      timerId: 2,
      wordList: [],
      typedHistory: [],
      caretRef: null,
      activeWordRef: null,
      nextIndex: 0,
   });
};

export const setTime = (time: number) => userConfigStore.setState({ time });

export const decreaseTime = () =>
   userConfigStore.setState((state) => ({ time: state.time - 1 }));

export const setTimerId = (timerId: NodeJS.Timer | null) =>
   wordStore.setState({ timerId });