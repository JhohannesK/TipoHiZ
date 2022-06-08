import {Context} from '../../../shared/types';
import {Login} from '../types';

const viewer = async (_: {}, {login}: Login, {models}: Context) => {
  return await models.Viewer.findByLogin(login);
};

const viewers = async (_: {}, __: {}, {models}: Context) => {
  return await models.Viewer.findAll({});
};

export {viewers, viewer};
