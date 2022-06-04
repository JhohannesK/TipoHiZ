import expressLoader from './express';
import apolloLoader from './apollo';

export default {
  init: async () => {
    const app = expressLoader();
    const server = await apolloLoader(app);

    return {app, server};
  },
};
