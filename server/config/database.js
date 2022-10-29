const { Sequelize } = require("sequelize");
require("dotenv").config();

const Connection = {
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: "5432",
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false,
  protocol: "postgres",
  dialectOptions: {
    ssl: true,
    native: true,
  },
};


const sequelize = new Sequelize(Connection);
sequelize.sync({ alter: true });
console.log("All models were synchronized successfully.");
sequelize.query("CREATE EXTENSION IF NOT EXISTS pg_trgm", { raw: true });

// initialize db
models = [
  require("../models/Review"),
  require("../models/Admin"),
];

for (model of models) {
  model(sequelize);
}


module.exports = sequelize;
