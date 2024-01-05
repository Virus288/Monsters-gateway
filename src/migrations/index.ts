import getConfig from '../tools/configLoader';

export default {
  client: 'mysql2',
  connection: {
    host: getConfig().mysql.host,
    user: getConfig().mysql.user,
    password: getConfig().mysql.password,
    database: getConfig().mysql.db,
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './actions',
  },
};
