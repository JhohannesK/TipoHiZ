import {Sequelize} from 'sequelize';
import config from '../config';

export default () => {
  const sequelize = new Sequelize(
    config.database,
    config.databaseUser,
    config.databasePassword,
    {
      dialect: 'postgres',
    }
  );

  return sequelize.sync;
};
