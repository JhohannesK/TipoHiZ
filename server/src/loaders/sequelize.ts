import {Sequelize} from 'sequelize';
import config from '../config';

export default new Sequelize(
  config.database,
  config.databaseUser,
  config.databasePassword,
  {
    dialect: 'postgres',
  }
);
