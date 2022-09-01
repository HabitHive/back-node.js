import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        tagName: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: false,
        underscored: false,
        modelName: "Tag",
        tableName: "tag",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Tag.hasMany(db.UserTag);
  }
}