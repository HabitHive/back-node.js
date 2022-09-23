const Sequelize = require("sequelize");

module.exports = class Refresh extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        refresh_id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        refresh_token: {
          type: Sequelize.STRING(1500),
          allowNull: false,
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
