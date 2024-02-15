import { userConfigStore } from '..';

export const setTheme = (theme: string) => userConfigStore.setState({ theme });

export const setType = (type: string) => userConfigStore.setState({ type });

export const setCategory = (category: string) =>
   userConfigStore.setState({ category });
