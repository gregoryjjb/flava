const util = require("util");
const getTrail = require("../config/trails");
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

    let round = Math.round;

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

            const targetWeekly = round(Number(stdout));
            const increment = (targetWeekly - currentNum) / weeksNum;

            let weeklyPlan = [];

            for (let i = 1; i <= weeksNum; i++) {
                weeklyPlan.push(round(currentNum + increment * i));
            }

            round = x => Number((Math.round(x * 2) / 2).toFixed(1));

            let dailyPlan = weeklyPlan.map(miles => {
                if (miles < 30) {
                    let long = round((miles * 0.2) / 1); // 20% Long x1
                    let same = round((miles * 0.7) / 3); // 70% Same x3
                    let short = round((miles * 0.1) / 1); // 10% Short x1

                    return [same, 0, same, 0, same, 0, short];
                } else if (miles >= 30 && miles < 60) {
                    let long = round((miles * 0.2) / 1); // 20% Long x1
                    let same = round((miles * 0.5) / 3); // 50% Same x3
                    let short = round((miles * 0.3) / 2); // 30% Short x2

                    return [long, same, short, same, short, same, 0];
                } else {
                    let long = round((miles * 0.2) / 1); // 20% Long x1
                    let same = round((miles * 0.6) / 4); // 60% Same x4
                    let short = round((miles * 0.2) / 2); // 20% Short x2
                    return [long, short, same, same, short, same, same];
                }
            });

            const flatten = arr =>
                arr.reduce((flat, next) => flat.concat(next), []);

            const clean = arr => flatten(arr).filter(n => n > 0);

            const dailyMin = Math.min(...clean(dailyPlan));
            const dailyMax = Math.max(...clean(dailyPlan));

            const trails = getTrail(dailyMin);

            await user.update({
                currentWeekly: currentNum,
                targetDistance: goalNum,
                timespanWeeks: weeksNum,
                weeklyTarget: targetWeekly,
                weeklyPlan,
                dailyPlan,
                trails,
            });

            res.json(user);
        }
    } else {
        res.status(401).end("No user logged in");
    }
});

module.exports = router;
