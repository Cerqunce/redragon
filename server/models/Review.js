const Sequelize = require("sequelize");

const Blog = (db) => {
  db.define(
    "Review",
    {
      // Model attributes are defined here

      title: {
        unique: false,
        type: Sequelize.STRING,
        allowNull: true,
      },
      content: {
        unique: false,
        type: Sequelize.TEXT("long"),
        allowNull: false,
      },
      summary: {
        unique: false,
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        unique: false,
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        unique: false,
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      Sequelize,
      paranoid: true,

      deletedAt: "deletedAt",
    }
  );
};
module.exports = Blog;
