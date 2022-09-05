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
          allowNull: false,
        },
        tag_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        period: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: false,
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
    db.UserTag.belongsTo(db.Schedule, {
      foreignKey: { name: "user_tag_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
}
