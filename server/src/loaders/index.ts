import expressLoader from './express';

export default {
  init: async () => {
    const app = expressLoader();

    return {app};
  },
};
