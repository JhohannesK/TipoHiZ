import {Optional} from 'sequelize/types';

export type ViewerAttributes = {
  id: string;
  username: string;
  email: string;
  password: string;
  role: string;
};

export type ViewerCreationAttributes = Optional<ViewerAttributes, 'id'>;

export interface Register {
  username: string;
  password: string;
  role: string;
  email: string;
}

export interface Login {
  login: string;
  password: string;
}
