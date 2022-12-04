import { userConfigStore, useStore } from '.';

export const setDisabled = (disabled: boolean) =>
   useStore.setState({ disabled });
export const setActiveWord = (activeWord: number) =>
   useStore.setState({ activeWord });
export const setUserInput = (userInput: string) =>
   useStore.setState({ userInput });
export const setTimerId = (timerId: NodeJS.Timer | null) =>
   useStore.setState({ timerId });

export const setTime = (time: number) => userConfigStore.setState({ time });
export const setTheme = (theme: string) => userConfigStore.setState({ theme });
export const setType = (type: string) => userConfigStore.setState({ type });
export const setCategory = (category: string) =>
   userConfigStore.setState({ category });
export const decreaseTime = () =>
   userConfigStore.setState((state) => ({ time: state.time - 1 }));
