const http = require('http');

const app = require('./app');

const port =  process.env.PORT || 4000;
const env = process.env.NODE_ENV || 'development';

let server = http.createServer(app);
server.listen(port);

console.log("HTTP server listening");
console.log("\tPort:", port);
console.log("\tEnvironment:", env);