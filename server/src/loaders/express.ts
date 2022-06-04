import express from 'express';
import cors from 'cors';

export default () => {
  const app = express();
  app.use(cors());
  return app;
};
