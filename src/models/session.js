const Sequelize = require("sequelize");

module.exports = class Refresh extends Sequelize.Model {
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
        modelName: "Refresh",
        tableName: "refreshs",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {}
};
