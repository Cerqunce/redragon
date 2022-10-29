const Sequelize = require("sequelize");

const Admin = (db) => {
  db.define(
    "Admin",
    {
      username: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        unique: false,
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      Sequelize,
      paranoid: true,

      deletedAt: "deletedAt",
    }
  );
};

module.exports = Admin;
