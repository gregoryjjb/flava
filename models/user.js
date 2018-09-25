module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        googleId: {
            type: DataTypes.STRING,
            unique: true,
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            isEmail: true,
        },
    });

    return User;
};
