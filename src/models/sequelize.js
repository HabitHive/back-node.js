const { Sequelize } = require("sequelize");

const config = require("../config/config.js");
const env = "development";
const { database, username, password } = config[env];
const sequelize = new Sequelize(database, username, password, config[env]);

module.exports = sequelize;
