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
        age: DataTypes.INTEGER,
        height: DataTypes.INTEGER,
        weight: DataTypes.INTEGER,
        longestDistance: DataTypes.INTEGER,
        bestMileTime: DataTypes.FLOAT,
    });

    User.associate = models => {
        models.User.hasMany(models.Session, { foreignKey: "userId" });
    };

    return User;
};
