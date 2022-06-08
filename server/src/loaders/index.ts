import expressLoader from './express';
import apolloLoader from './apollo';
import sequelize from './sequelize';

export default {
  init: async () => {
    sequelize.sync();
    const app = expressLoader();
    const server = await apolloLoader(app);

    return {app, server};
  },
};
