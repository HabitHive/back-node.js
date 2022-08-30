export * from "./sequelize.js";
import sequelize from "./sequelize.js";

import User from "./user.js";
import Pet from "./pet.js";

const db = {};

db.sequelize = sequelize;
db.User = User;
db.Pet = Pet;

User.init(sequelize);
Pet.init(sequelize);

User.associate(db);
Pet.associate(db);

export { db };
