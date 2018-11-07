const util = require("util");
const exec = util.promisify(require("child_process").exec);

const express = require("express");
const models = require("../models");
const authorize = require("../auth/authorize");

const router = express.Router();

router.use(authorize);

router.post("/info", async (req, res) => {
    const user = await models.User.findOne({
        where: { id: res.locals.userId },
    });

    const { age, height, weight, longestDistance, bestMileTime } = req.body;

    await user.update({
        age,
        height,
        weight,
        longestDistance,
        bestMileTime,
    });

    res.json(user);
});

router.get("/plan/:goal", async (req, res) => {
    const { goal } = req.params;
    const { userId } = res.locals;

    const user = await models.User.findOne({ where: { id: userId } });

    if (user) {
        const goalNum = Number(goal);

        if (isNaN(goalNum)) {
            return res.status(400).end("Goal must be a number");
        } else {
            const cmd = `python predict.py ${goalNum}`;
            const { stdout, stderr } = await exec(cmd, { cwd: "./ml" });

            res.json({ weeklyMiles: Number(stdout).toPrecision(2) });
        }
    } else {
        res.status(401).end("No user logged in");
    }
});

module.exports = router;
