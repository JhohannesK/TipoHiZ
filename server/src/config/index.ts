import 'dotenv/config';

export default {
  serverPort: process.env.SERVER_PORT as string,
  database: process.env.DATABASE as string,
  databaseUser: process.env.DATABASE_USER as string,
  databasePassword: process.env.DATABASE_PASSWORD as string,
  accessOrigin: process.env.ACCESS_ORIGIN as string,
  jwtSecret: process.env.JWT_SECRET as string,
  saltRounds: process.env.SALT_ROUNDS as string,
};
