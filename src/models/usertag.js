import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class UserTag extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                
            },
            {
                sequelize,
                timestamps: true,
                paranoid: false,
                underscored: false,
                modelName: "UserTag",
                tableName: "userTag",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {

    }
}
