export * from "./sequelize.js";
import sequelize from "./sequelize.js";

import User from "./user.js"
import Tag from "./tag.js"
import UserTag from "./usertag.js"

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Tag = Tag;
db.UserTag = Tag;

User.init(sequelize);
Tag.init(sequelize);
UserTag.init(sequelize);

User.associate(db);
Tag.associate(db);
UserTag.associate(db);

export { db };