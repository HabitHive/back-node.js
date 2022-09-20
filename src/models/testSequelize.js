const { Sequelize } = require("sequelize");

const config = require("../config/config.js");
const env = "test";
const { database, username, password } = config[env];
const testSequelize = new Sequelize(database, username, password, config[env]);

module.exports = testSequelize;
