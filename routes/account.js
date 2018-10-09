const Sequelize = require("sequelize");
const express = require("express");
const models = require("../models");
const { generateSafeKey } = require("../auth/session");
const parseToken = require("../auth/parse-token");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { token, sessionKey } = req.body;

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
                        valid: true,
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
    } else if (sessionKey) {
        // Resume old session
        const session = await models.Session.findOne({
            where: { key: sessionKey },
        });

        try {
            // Verify session
            if (!session) throw "Session key invalid";
            if (session.valid !== true) throw "Session expired";

            // Verify user
            const user = await session.getUser();
            if (!user) throw "User not found for session";

            res.json({ user });
        } catch (err) {
            res.status(400).json({
                error: err,
            });
        }
    } else {
        res.status(400).json({
            error: "No session ID or token sent",
        });
    }
});

router.get("/logout", async (req, res) => {
    const key = req.cookies.sessionKey;

    if (key) {
        const session = await models.Session.findOne({ where: { key } });

        if (session) await session.update({ valid: false });
    }

    res.status(200).end();
});

module.exports = router;
