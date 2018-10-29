const express = require("express");
const cookieParser = require("cookie-parser");
const fs = require("fs");

const account = require("./routes/account");
const user = require("./routes/user");

const app = express();
app.use(express.json());
app.use(cookieParser());

const api = express.Router();

api.use("/account", account);
api.use("/user", user);

api.get("/hellothere", (req, res) => {
    res.json({ message: "General Kenobi!" });
});

app.use("/api", api);

app.get("/test", (req, res) => {
    res.send("Node server running");
});

// Main page
app.get("/", (req, res) => {
    const indexHtml = __dirname + "/client/build/index.html";

    // Check to see if the front end exists first
    if (fs.existsSync(indexHtml)) {
        res.sendFile(__dirname + "/client/build/index.html");
    } else {
        res.send(
            "Node server running, client/build/index.html not found. You may have forgot to build the frontend."
        );
    }
});

app.use(express.static("client/build"));

module.exports = app;
