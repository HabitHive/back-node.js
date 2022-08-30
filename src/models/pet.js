import Sequelize from "sequelize";
import { sequelize } from "./sequelize.js";

export default class Pet extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
        },
        type: Sequelize.INTEGER,
        pet_name: Sequelize.STRING,
        level: Sequelize.INTEGER,
        exp: Sequelize.INTEGER,
      },
      {
        sequelize,
        timestamps: true,
        paranoid: false,
        underscored: false,
        modelName: "Pet",
        tableName: "pet",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Pet.belongsTo(db.User, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
}
