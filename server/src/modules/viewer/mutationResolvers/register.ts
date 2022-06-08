import jwt from 'jsonwebtoken';
import config from '../../../config';
import {Context} from '../../../shared/types';
import {omit} from '../../../utils';
import {Register} from '../types';

// TODO: handle unhappy cases(errors-cases)
export default async (_: {}, args: Register, {models}: Context) => {
  const {username, password, email, role} = args;
  const user = await models.Viewer.create({username, email, password, role});
  const userSansPassword = omit({...user}, 'password');
  const token = jwt.sign({data: {userSansPassword}}, config.jwtSecret);
  return {token};
};
