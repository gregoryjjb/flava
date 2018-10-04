module.exports = (sequelize, DataTypes) => {
    const Session = sequelize.define("Session", {
        key: DataTypes.STRING,
        valid: DataTypes.BOOLEAN,
    });

    Session.associate = models => {
        models.Session.belongsTo(models.User, { foreignKey: "userId" });
    };

    return Session;
};
