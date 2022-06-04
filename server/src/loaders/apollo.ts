import {ApolloServer} from 'apollo-server-express';
import {Express} from 'express';

export default async (app: Express) => {
  const server = new ApolloServer({});

  await server.start();
  server.applyMiddleware({app, path: '/', cors: {}});
  return server;
};
