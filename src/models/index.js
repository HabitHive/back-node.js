const sequelize = require("./sequelize");
const testSequelize = require("./testSequelize");

const User = require("./user");
const Pet = require("./pet");
const UserTag = require("./usertag");
const Tag = require("./tag");
const Point = require("./point");
const Schedule = require("./schedule");
const Done = require("./done");
const Session = require("./session");

const db = {};

db.sequelize = sequelize;
db.testSequelize = testSequelize;
db.User = User;
db.Pet = Pet;
db.UserTag = UserTag;
db.Tag = Tag;
db.Point = Point;
db.Schedule = Schedule;
db.Done = Done;
db.Session = Session;

User.init(sequelize);
UserTag.init(sequelize);
Tag.init(sequelize);
Point.init(sequelize);
Schedule.init(sequelize);
Pet.init(sequelize);
Done.init(sequelize);
Session.init(sequelize);

User.init(testSequelize);
UserTag.init(testSequelize);
Tag.init(testSequelize);
Point.init(testSequelize);
Schedule.init(testSequelize);
Pet.init(testSequelize);
Done.init(testSequelize);
Session.init(testSequelize);

User.associate(db);
UserTag.associate(db);
Tag.associate(db);
Point.associate(db);
Schedule.associate(db);
Pet.associate(db);
Done.associate(db);
Session.associate(db);

module.exports = { db, sequelize, testSequelize };
