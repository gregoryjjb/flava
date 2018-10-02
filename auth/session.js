const crypto = require("crypto");
const models = require("../models");

/**
 * Generate a random session key
 * @param {any} seed Seed for the random generation
 */
const generateKey = seed => {
    let sha = crypto.createHash("sha512");
    seed = Math.random().toString() + seed;
    sha.update(seed);
    return sha.digest("hex");
};

const generateSafeKey = async seed => {
    let key = null;

    while (!key) {
        key = generateKey(seed);

        // If a session with that key exists, try again
        let s = await models.Session.findOne({ where: { key } });
        if (s) key = null;
    }

    return key;
};

module.exports = { generateKey, generateSafeKey };
