const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: ".env.local" });

const http = require("http");

const app = require("./app");
const models = require("./models");

const port = process.env.PORT || 4000;
const env = process.env.NODE_ENV || "development";

let server;

models.sequelize
    .sync({ force: false })
    .then(() => {
        server = http.createServer(app);
        server.listen(port);
    })
    .catch(err => {
        console.error("Error syncing models:", err);
    });

console.log("HTTP server listening");
console.log("\tPort:", port);
console.log("\tEnvironment:", env);
