import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        tagname: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
        },
        category: {
          type: Sequelize.STRING(10),
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
  static associate(db) {}
}
