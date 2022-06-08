import sequelize from '../../loaders/sequelize';
import {CreationOptional, DataTypes, Model} from 'sequelize';
import {ViewerAttributes, ViewerCreationAttributes} from './types';
import bcrypt from 'bcryptjs';
import config from '../../config';

class Viewer extends Model<ViewerAttributes, ViewerCreationAttributes> {
  declare id: CreationOptional<string>;
  declare username: string;
  declare password: string;
  declare role: string;
  declare email: string;

  static async findByLogin(login: string): Promise<Viewer | null> {
    let user = await this.findOne({where: {username: login}});
    if (!user) {
      user = await this.findOne({where: {email: login}});
    }

    return user;
  }

  async generatePasswordHash(): Promise<string> {
    return await bcrypt.hash(this.password, Number(config.saltRounds));
  }
}

Viewer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {notEmpty: true},
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {notEmpty: true},
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {notEmpty: true, isEmail: true},
    },
    role: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['participant', 'administer'],
    },
  },
  {
    sequelize,
    tableName: 'viewer',
  }
);

Viewer.addHook('beforeCreate', async (viewer: Viewer) => {
  viewer.password = await viewer.generatePasswordHash();
});

export default Viewer;
