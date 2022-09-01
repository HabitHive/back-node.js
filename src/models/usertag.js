import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class UserTag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        period: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        startDate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        endDate: {
          type: Sequelize.DATE,
          allowNull: false,
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
  static associate(db) {
    db.UserTag.belongsTo(db.User);
    db.UserTag.belongsTo(db.Tag);
    db.UserTag.hasMany(db.Schedule);
  }
}
