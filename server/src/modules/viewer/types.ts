import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize/types';

export default interface ViewerModel
  extends Model<
    InferAttributes<ViewerModel>,
    InferCreationAttributes<ViewerModel>
  > {
  id: CreationOptional<string>;
  username: string;
  email: string;
  role: string;
  password: string;
}

export interface Register {
  username: string;
  email: string;
  password: string;
}

export interface Login {
  login: string;
  password: string;
}
