import { userConfigStore, wordStore } from '.';

export const setDisabled = (disabled: boolean) =>
   wordStore.setState({ disabled });
export const setActiveWord = (activeWord: number) =>
   wordStore.setState({ activeWord });
export const setUserInput = (userInput: string) =>
   wordStore.setState({ userInput });
export const setTimerId = (timerId: NodeJS.Timer | null) =>
   wordStore.setState({ timerId });
export const setWordList = (wordList: string[]) =>
   wordStore.setState({ wordList });
export const setCaretRef = (
   caretRef: React.RefObject<HTMLSpanElement> | null
) => {
   wordStore.setState({ caretRef });
};

export const setTime = (time: number) => userConfigStore.setState({ time });
export const setTheme = (theme: string) => userConfigStore.setState({ theme });
export const setType = (type: string) => userConfigStore.setState({ type });
export const setCategory = (category: string) =>
   userConfigStore.setState({ category });
export const decreaseTime = () =>
   userConfigStore.setState((state) => ({ time: state.time - 1 }));
