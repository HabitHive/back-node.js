import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";
import UserTag from "./usertag.js";

export default class Point extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        point_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        user_tag_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: UserTag,
            key: "user_tag_id",
          },
        },
        point: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: false,
        underscored: false,
        modelName: "Point",
        tableName: "points",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Point.belongsTo(db.User, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
}
