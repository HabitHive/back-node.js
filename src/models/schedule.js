import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class Schedule extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        timeCycle: {
          type: Sequelize.INTEGER(50),
          allowNull: false,
        },
        weekCycle: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: false,
        underscored: false,
        modelName: "Schedule",
        tableName: "schedule",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Schedule.belongsTo(db.UserTag);
  }
}
