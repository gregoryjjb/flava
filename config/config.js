const Sequelize = require("sequelize");

module.exports = {
    development: {
        dialect: "sqlite",
        storage: "./db.development.sqlite",
        logging: false,
        operatorsAliases: Sequelize.Op,
        sync: { force: false },
    },
    production: {
        dialect: process.env.DB_DIALECT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOSTNAME,
        logging: false,
        operatorsAliases: Sequelize.Op,
    },
};
