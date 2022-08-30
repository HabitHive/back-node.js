import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class Point extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        point: {
          type: Sequelize.INTEGER(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: false,
        underscored: false,
        modelName: "Point",
        tableName: "point",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {}
}
