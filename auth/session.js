var crypto = require("crypto");

const generateKey = seed => {
    var sha = crypto.createHash("sha512");
    var seed = Math.random().toString() + seed;
    sha.update(seed);
    return sha.digest("hex");
};

module.exports = { generateKey };
