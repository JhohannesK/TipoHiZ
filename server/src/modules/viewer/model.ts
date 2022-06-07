import sequelize from '../../loaders/sequelize';
import {CreationOptional, DataTypes, Model} from 'sequelize';
import {ViewerAttributes, ViewerCreationAttributes} from './types';

class Viewer extends Model<ViewerAttributes, ViewerCreationAttributes> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare password: string;
  declare role: string;
  declare email: string;
}

Viewer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {type: DataTypes.STRING, allowNull: false, unique: true},
    password: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false, unique: true},
    role: {type: DataTypes.STRING, allowNull: false, unique: true},
  },
  {
    sequelize,
    tableName: 'viewer',
  }
);

export default Viewer;
