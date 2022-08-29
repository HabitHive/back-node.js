import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class UserTag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        tagname: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        content: {
          type: Sequelize.STRING(200),
          allowNull: false,
        },
        image: {
          type: Sequelize.STRING(200),
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: false,
        underscored: false,
        modelName: "UserTag",
        tableName: "userTag",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {}
}
