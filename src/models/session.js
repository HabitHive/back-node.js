const Sequelize = require("sequelize");

const sequelize = require("./sequelize");

module.exports = class Session extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        session_id: {
          type: Sequelize.STRING,
          primaryKey: true,
        },
        expires: {
          type: Sequelize.INTEGER,
        },
        data: {
          type: Sequelize.JSON,
        },
      },
      {
        sequelize,
        timestamps: false,
        paranoid: false,
        underscored: false,
        modelName: "Session",
        tableName: "sessions",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {}
};
