const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const config = require("../config/config.js");
const env = process.env.CONFIG || "development";
const { database, username, password } = config[env];
const sequelize = new Sequelize(database, username, password, config[env]);

module.exports = sequelize;
