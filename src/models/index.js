export * from "./sequelize.js";
import sequelize from "./sequelize.js";

import User from "./user.js";
import Pet from "./pet.js";
import UserTag from "./usertag.js";
import Tag from "./tag.js";
import Point from "./point.js";
import Schedule from "./schedule.js";

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Pet = Pet;
db.UserTag = UserTag;
db.Tag = Tag;
db.Point = Point;
db.Schedule = Schedule;

User.init(sequelize);
UserTag.init(sequelize);
Tag.init(sequelize);
Point.init(sequelize);
Schedule.init(sequelize);
Pet.init(sequelize);

User.associate(db);
UserTag.associate(db);
Tag.associate(db);
Point.associate(db);
Schedule.associate(db);
Pet.associate(db);

export { db };
