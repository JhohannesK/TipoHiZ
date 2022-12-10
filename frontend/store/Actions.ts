import React from 'react';
import { userConfigStore, wordStore } from '.';

export const setDisabled = (disabled: boolean) =>
   wordStore.setState({ disabled });
export const setActiveWord = (activeWord: string) =>
   wordStore.setState({ activeWord });
export const setUserInput = (userInput: string) =>
   wordStore.setState({ userInput });
export const setTimerId = (timerId: NodeJS.Timer | null) =>
   wordStore.setState({ timerId });
export const setWordList = (wordList: string[]) => {
   const shuffledList = wordList.sort(() => Math.random() - 0.5);
   wordStore.setState((state) => ({
      wordList: shuffledList,
      activeWord: shuffledList[0],
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
   }));
};

export const setTime = (time: number) => userConfigStore.setState({ time });
export const setTheme = (theme: string) => userConfigStore.setState({ theme });
export const setType = (type: string) => userConfigStore.setState({ type });
export const setCategory = (category: string) =>
   userConfigStore.setState({ category });
export const decreaseTime = () =>
   userConfigStore.setState((state) => ({ time: state.time - 1 }));
