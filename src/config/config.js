let config = {};

/* mongodb connection configuration */
let noSqlDbConfig = {
  url: process.env.DB_URL || 'mongodb://localhost:27017/',
  name: process.env.DB_NAME || 'prdxn',
};

config.db = {
  noSqlDbConfig,
};

/* JWT Authentication Credentials  */
config.jwt = {
  secret: process.env.JWT_SECRET  || 'prdxn',
  expireIn: process.env.JWT_EXPIRE_IN || '1d',
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
};

config.client = process.env.CLIENT_URL || '*';

module.exports = config;
