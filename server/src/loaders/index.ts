import expressLoader from './express';
import apolloLoader from './apollo';
import postgresLoader from './postgres';

export default {
  init: async () => {
    postgresLoader();
    const app = expressLoader();
    const server = await apolloLoader(app);

    return {app, server};
  },
};
