// User define DB Creadentials
const dbCredentials = require('./config').db;
const database = process.env.DATABASE_DRIVER || '';

if (database.toLowerCase() === 'mongodb') {

  //Bring in the mongoose module
  const mongoose = require('mongoose');
  const { url, name } = dbCredentials.noSqlDbConfig;
  const dbURI = url + name;

  //console to check what is the dbURI refers to
  console.log('Database URL is => ', dbURI);

  //Open the mongoose connection to the database
  mongoose.connect(dbURI, {
    config: {
      autoIndex: false,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Db Connection
  let db = mongoose.connection;

  db.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
  });

  db.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
  });

  db.on('disconnected', function () {
    console.log('Mongoose disconnected');
  });

  process.on('SIGINT', function () {
    db.close(function () {
      console.log('Mongoose disconnected through app termination');
      process.exit(0);
    });
  });

  //Exported the database connection to be imported at the server
  exports.default = db;
} else if (database.toLowerCase() === 'sql') {
  //Bring in the sequelize module
  const Sequelize = require('sequelize');
  const {
    name,
    username,
    password,
    host,
    port,
    dialect,
  } = dbCredentials.sqlDbConfig;

  //logging: false because sequelize by default log all DB activities in console which will unneccessarily flood the console.
  const sequelize = new Sequelize(name, username, password, {
    host,
    port,
    dialect,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });

  sequelize
    .authenticate()
    .then(() =>
      console.log(
        `Sequelize connection started on database "${name}" from "${dialect}"`
      )
    )
    .catch((err) => console.error(`Sequelize connection error: ${err}`));

  process.on('SIGINT', function () {
    console.log('Sequelize disconnected through app termination');
    process.exit(0);
  });

  //Exported the database connection to be imported at the server
  exports.default = sequelize;
} else {
  console.log(
    '\x1b[33m%s\x1b[0m',
    '-> Application is running without database connection!'
  );
}
