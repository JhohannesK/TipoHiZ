import {ApolloServer} from 'apollo-server-express';
import {Express} from 'express';
import config from '../config';
import models from '../modules';
import schema from '../modules/schema';

const corsOptions = {
  origin: config.accessOrigin,
  methods: 'GET, HEAD, POST, PUT, DELETE , PATCH',
  credentials: true,
};

export default async (app: Express) => {
  const server = new ApolloServer({schema, context: {models}});

  await server.start();
  server.applyMiddleware({app, path: '/graphql', cors: corsOptions});
  return server;
};
