import config from './config';
import loaders from './loaders';

const startServer = async () => {
  const {app, server} = await loaders.init();
  const port = config.serverPort;
  app.listen({port}, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    );
  });
};

startServer();
