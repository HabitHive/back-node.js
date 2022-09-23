const sequelize = require("./sequelize");

const User = require("./user");
const Pet = require("./pet");
const UserTag = require("./usertag");
const Tag = require("./tag");
const Point = require("./point");
const Schedule = require("./schedule");
const Done = require("./done");
const Refresh = require("./refresh");

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Pet = Pet;
db.UserTag = UserTag;
db.Tag = Tag;
db.Point = Point;
db.Schedule = Schedule;
db.Done = Done;
db.Refresh = Refresh;

User.init(sequelize);
UserTag.init(sequelize);
Tag.init(sequelize);
Point.init(sequelize);
Schedule.init(sequelize);
Pet.init(sequelize);
Done.init(sequelize);
Refresh.init(sequelize);

User.associate(db);
UserTag.associate(db);
Tag.associate(db);
Point.associate(db);
Schedule.associate(db);
Pet.associate(db);
Done.associate(db);
Refresh.associate(db);

module.exports = db;
