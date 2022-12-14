const Sequelize = require("sequelize");

module.exports = class Tag extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        tag_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        tag_name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        color: { type: Sequelize.INTEGER },
      },
      {
        sequelize,
        timestamps: false,
        paranoid: false,
        underscored: false,
        modelName: "Tag",
        tableName: "tags",
        charset: "utf8",
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.Tag.hasMany(db.UserTag, {
      foreignKey: { name: "tag_id", allowNull: false },
      onUpdate: "cascade",
    });
    db.Tag.belongsTo(db.User, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
};
