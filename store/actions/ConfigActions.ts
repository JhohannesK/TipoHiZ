import { resolveWordCount } from '../../lib/words';
import { userConfigStore } from '..';

export const setTheme = (theme: string) => userConfigStore.setState({ theme });

export const setWordCount = (wordCount: number) =>
   userConfigStore.setState({ wordCount: resolveWordCount(wordCount) });

export const setType = (type: string) => userConfigStore.setState({ type });

export const setCategory = (category: string) =>
   userConfigStore.setState({ category });

export const setLanguage = (language: string) =>
   userConfigStore.setState({ language });

export const toggleSound = () => {
   const { sound } = userConfigStore.getState();
   userConfigStore.setState({ sound: !sound });
};
