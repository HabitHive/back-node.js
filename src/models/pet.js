const Sequelize = require("sequelize");

const sequelize = require("./sequelize");

module.exports = class Pet extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        pet_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: { type: Sequelize.INTEGER, allowNull: false },
        level: { type: Sequelize.INTEGER, defaultValue: 1 },
        exp: { type: Sequelize.INTEGER, defaultValue: 0 },
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
};
