const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        user_id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        email: {
          type: Sequelize.STRING(30),
          allowNull: true,
        },
        password: {
          type: Sequelize.STRING(100),
          allowNull: true,
        },
        nickname: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        interest: {
          type: Sequelize.STRING,
          defaultValue: "#",
        },
        point: {
          type: Sequelize.INTEGER,
          defaultValue: 500,
        },
        social: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        provider: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        verify: {
          type: Sequelize.STRING,
          allowNull: true,
        },
      },
      {
        sequelize /* static init 메서드의 매개변수와 연결되는 옵션으로, db.sequelize 객체를 넣어야 한다. */,
        timestamps: false /* true : 각각 레코드가 생성, 수정될 때의 시간이 자동으로 입력된다. */,
        underscored: false /* 카멜 표기법을 스네이크 표기법으로 바꾸는 옵션 */,
        modelName: "User" /* 모델 이름을 설정. */,
        tableName: "users" /* 데이터베이스의 테이블 이름. */,
        paranoid: false /* true : deletedAt이라는 컬럼이 생기고 지운 시각이 기록된다. */,
        charset: "utf8" /* 인코딩 */,
        collate: "utf8_general_ci",
      }
    );
  }
  static associate(db) {
    db.User.hasMany(db.Pet, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    db.User.hasMany(db.UserTag, {
      foreignKey: { name: "user_id", allowNull: false },
      sourceKey: "user_id",
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    db.User.hasMany(db.Point, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
    db.User.hasMany(db.Schedule, {
      foreignKey: { name: "user_id", allowNull: false },
      onDelete: "cascade",
      onUpdate: "cascade",
    });
  }
};
