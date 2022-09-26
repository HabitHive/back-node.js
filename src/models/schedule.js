const Sequelize = require("sequelize");

module.exports = class Schedule extends Sequelize.Model {
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
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        time_cycle: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        week_cycle: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        after_date: {
          type: Sequelize.DATE,
          allowNull: true,
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
    db.Schedule.belongsTo(db.User, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
};
