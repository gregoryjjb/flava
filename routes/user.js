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

router.put("/plan", async (req, res) => {
    const { currentWeekly, goalDistance, weeks } = req.body;
    const { userId } = res.locals;

    const user = await models.User.findOne({ where: { id: userId } });

    if (user) {
        const currentNum = Number(currentWeekly);
        const goalNum = Number(goalDistance);
        const weeksNum = Number(weeks);

        if (isNaN(goalNum)) {
            return res.status(400).end("Goal must be a number");
        } else {
            const py = process.env.PYTHON_BIN || "python";
            const cmd = `${py} predict.py ${goalNum}`;
            const { stdout, stderr } = await exec(cmd, { cwd: "./ml" });

            const targetWeekly = Math.round(Number(stdout));
            const increment = (targetWeekly - currentNum) / weeksNum;

            let weeklyPlan = [];

            for (let i = 1; i <= weeksNum; i++) {
                weeklyPlan.push(Math.round(currentNum + increment * i));
            }

            res.json({ weeklyTarget: targetWeekly, weeklyPlan });
        }
    } else {
        res.status(401).end("No user logged in");
    }
});

module.exports = router;
