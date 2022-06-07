import {Optional} from 'sequelize/types';

export type ViewerAttributes = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
};

export type ViewerCreationAttributes = Optional<ViewerAttributes, 'id'>;
