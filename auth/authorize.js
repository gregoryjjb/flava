const models = require("../models");

const authorize = async (req, res, next) => {
    const { sessionKey } = req.cookies;

    if (sessionKey) {
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

            res.locals.userId = user.id;
            next();
        } catch (e) {
            res.status(401).end("Access denied");
        }
    } else {
        res.status(401).end("Access denied");
    }
};

module.exports = authorize;
