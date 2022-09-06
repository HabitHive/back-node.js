import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class UserTag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_tag_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        tag_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        period: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        success: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: false,
        underscored: false,
        modelName: "UserTag",
        tableName: "userTags",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.UserTag.belongsTo(db.User, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    db.UserTag.belongsTo(db.Tag, {
      foreignKey: { name: "tag_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    db.UserTag.hasMany(db.Schedule, {
      foreignKey: { name: "user_tag_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
}
