import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class Schedule extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        schedule_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_tag_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        time_cycle: {
          type: Sequelize.INTEGER(50),
          allowNull: false,
        },
        week_cycle: {
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
    db.Schedule.belongsTo(db.UserTag, {
      foreignKey: { name: "user_tag_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
}
