const Sequelize = require("sequelize");
const express = require("express");
const models = require("../models");

const router = express.Router();

router.get("/post", async (req, res) => {
    const { token, sessionId } = req.body;

    if (token) {
        // Create new session

        parseToken(
            token,
            async payload => {
                // Check if user already exists
                const user = await models.User.findOne({
                    where: {
                        googleId: payload.sub,
                    },
                });

                if (user) {
                    // Create new session for user
                } else {
                    // Create user and session
                }
            },
            error => {
                res.status(400).json({
                    error: error.message,
                });
            }
        );
    } else if (sessionId) {
        // Resume old session
    } else {
        res.status(400).json({
            error: "No session ID or token sent",
        });
    }
});

module.exports = router;
