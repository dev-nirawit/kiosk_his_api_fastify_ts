import knex from 'knex';
var options = {
  HIS: {
    client: process.env.HIS_DB_CLIENT || 'mysql',
    connection: {
      timezone: 'utc',
      host: process.env.HIS_DB_HOST,
      user: process.env.HIS_DB_USER,
      password: process.env.HIS_DB_PASSWORD,
      database: process.env.HIS_DB_NAME,
      port: +process.env.HIS_DB_PORT || 3306,
      charset: process.env.HIS_DB_CHARSET || 'utf8',
      multipleStatements: true,
      dateStrings: true
    },
    pool: {
      min: 2, max: 10,
      afterCreate: (conn, done) => {
        conn.query('SET NAMES utf8', (err) => {
          done(err, conn);
        });
      }
    },
  },
};

const dbConnection = (type = 'HIS') => {
  let option = options[type.toUpperCase()];
  // option['pool'] = { min: 2, max: 10 };
  return knex(option);
};

module.exports = dbConnection;
