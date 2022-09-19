const Sequelize = require("sequelize");

const sequelize = require("./sequelize");

module.exports = class Done extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        done_id: {
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
          allowNull: false,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        time_cycle: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        timestamps: true,
        paranoid: false,
        underscored: false,
        modelName: "Done",
        tableName: "done",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Done.belongsTo(db.User, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    db.Done.belongsTo(db.UserTag, {
      foreignKey: { name: "user_tag_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
};
