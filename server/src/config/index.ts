import 'dotenv/config';

export default {
  serverPort: process.env.SERVER_PORT as string,
  database: process.env.DATABASE as string,
  databaseUser: process.env.DATABASE_USER as string,
  databasePassword: process.env.DATABASE_PASSWORD as string,
};
