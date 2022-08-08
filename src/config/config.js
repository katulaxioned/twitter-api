let config = {};

/* mongodb connection configuration */
let noSqlDbConfig = {
  url: process.env.DB_URL || 'mongodb://localhost:27017/',
  name: process.env.DB_NAME || 'prdxn',
};

/* sql connection configuration */
let sqlDbConfig = {
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || '1433',
  dialect: process.env.DB_DIALECT || 'mssql',
  name: process.env.DB_NAME || 'prdxn',
};

config.db = {
  noSqlDbConfig,
  sqlDbConfig,
};

/* JWT Authentication Credentials  */
config.jwt = {
  secret: process.env.JWT_SECRET  || 'prdxn',
  expireIn: process.env.JWT_EXPIRE_IN || '1d',
  algorithm: process.env.JWT_ALGORITHM || 'HS256',
};

config.client = process.env.CLIENT_URL || '*';

/* Swagger Definition */
config.swaggerDefinition = {
  info: {
    title: 'PRDXN Node API Boilerplate',
    version: '1.0.0',
    description: '',
  },
  host: process.env.HOST || 'localhost:8000',
  basePath: '/api',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      scheme: 'bearer',
      in: 'header',
    },
  },
};
config.swaggerOptions = {
  customSiteTitle: '[Project Title]',
  customCss: '',
  customfavIcon: '',
};

module.exports = config;
