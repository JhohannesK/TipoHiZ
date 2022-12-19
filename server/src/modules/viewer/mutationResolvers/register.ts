import jwt from 'jsonwebtoken';
import config from '../../../config';
import {Context} from '../../../shared/types';
import {Register} from '../types';

// TODO: handle unhappy cases(errors-cases)
export default async (_: {}, args: Register, {models}: Context) => {
  const {username, password, email, role} = args;
  const viewer = await models.Viewer.create({
    username,
    email,
    password,
    role: role || 'participant',
  });
  // nullify password before tokenization
  viewer.password = '-1';
  const token = jwt.sign({data: viewer}, config.jwtSecret);
  return {token, viewer: viewer};
};
