const Sequelize = require("sequelize");
const express = require("express");
const models = require("../models");
const { generateSafeKey } = require("../auth/session");
const parseToken = require("../auth/parse-token");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { token, sessionId } = req.body;

    if (token) {
        parseToken(
            token,
            async payload => {
                console.log("Google ID", payload.sub);
                let firstLogin = false;

                // Check if user already exists
                let user = await models.User.findOne({
                    where: {
                        googleId: payload.sub,
                    },
                });

                // Create user if does not exist
                if (!user) {
                    user = await models.User.create({
                        googleId: payload.sub,
                        firstname: payload.given_name,
                        lastname: payload.family_name,
                        email: payload.email,
                    });

                    firstLogin = true;
                }

                if (user) {
                    // Create new session for user
                    const key = await generateSafeKey(token.substr(0, 30));
                    const session = await models.Session.create({
                        key,
                        userId: user.id,
                    });

                    session.setUser(user);

                    res.json({
                        sessionKey: key,
                        firstLogin,
                        user,
                    });
                } else {
                    // Could not find or create user
                    res.status(400).json({
                        error: "Could not find or create user with token",
                    });
                }

                res.end();
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
