import Sequelize from "sequelize";

import { sequelize } from "./sequelize.js";

export default class Tag extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                
            },
            {
                sequelize,
                timestamps: true,
                paranoid: false,
                underscored: false,
                modelName: "Tag",
                tableName: "tag",
                charset: "utf8",
                collate: "utf8_general_ci",
            }
        );
    }
    static associate(db) {

    }
}
