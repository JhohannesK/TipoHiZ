import {AuthenticationError, UserInputError} from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import config from '../../../config';
import {Context} from '../../../shared/types';
import {Login} from '../types';

export default async (_: {}, args: Login, {models}: Context) => {
  const {login, password} = args;
  const viewer = await models.Viewer.findByLogin(login);
  if (!viewer) {
    throw new UserInputError('No user found with this login credentials');
  }
  const isValid = await viewer.validatePassword(password);
  if (!isValid) {
    throw new AuthenticationError('Invalid password');
  }

  // nullify password before tokenization
  viewer.password = '-1';
  const token = jwt.sign({data: viewer}, config.jwtSecret);
  return {token, viewer: viewer};
};
