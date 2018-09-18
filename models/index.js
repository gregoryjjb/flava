const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const Sequelize = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];
const db = {};

var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
);

sequelize
    .authenticate()
    .then(() => {
        if (env != "test") {
            console.log("Database connection established");
            console.log("\tDialect:", config.dialect);
            console.log("\tUsername:", config.username);
            console.log("\tDatabase:", config.database);
            console.log("\tHost:", config.host);
        }
    })
    .catch(err => {
        console.error("Unable to connect to database:", err);
    });

fs.readdirSync(__dirname)
    .filter(
        file =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach(file => {
        let model = sequelize["import"](path.join(__dirname, file));
        db[model.name] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
