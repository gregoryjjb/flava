const Sequelize = require("sequelize");
const express = require("express");
const models = require("../models");

const router = express.Router();

router.get("/post", async (req, res) => {
    const users = await models.User.findAll();
    res.json(users);
});

module.exports = router;
