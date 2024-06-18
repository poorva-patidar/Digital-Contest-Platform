const Sequelize = require("sequelize");
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, NODE_PORT } = require('./config/environment');

async function performMigration() {
  try {

    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        dialect: "postgres",
        port: NODE_PORT,
        ssl: false,
        pool: {
          max:10
        }
    });

    await sequelize.authenticate();
      
    const { Umzug, SequelizeStorage } = require("umzug");
    const umzug = new Umzug({
      migrations: { glob: "migrations/*.js" },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });

    await umzug.up();

  } catch (error) {
    console.log(error);
  }
}

performMigration();
