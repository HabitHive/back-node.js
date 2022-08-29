export * from "./sequelize.js";
import sequelize from "./sequelize.js";

import User from "./user.js";

const db = {};

db.sequelize = sequelize;
db.User = User;

User.init(sequelize);

User.associate(db);

export { db };
