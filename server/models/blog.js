const Sequelize = require("sequelize");

const Blog = (db) => {
  db.define(
    "Blog",
    {
      // Model attributes are defined here

      html: {
        unique: false,
        type: Sequelize.STRING,
        allowNull: true,
      },
        draft: {
            unique: false,
            type: Sequelize.BOOLEAN,
            allowNull: false,
        }
      },
    {
      Sequelize,
      paranoid: true,

      deletedAt: "deletedAt",
    }
  );
};
module.exports = Blog;
