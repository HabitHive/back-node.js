import Tag from "../../models/tag.js";
import User from "../../models/user.js";
import UserTag from "../../models/usertag.js";
import { Op } from "sequelize";

export default class tagRepositories {
  interest = async (userId) => {
    const userInfo = await User.findOne({ where: { user_id: userId } });
    return userInfo;
  };

  recommended = async (uaerInterest) => {
    const tagList = await Tag.findAll({
      where: { category: { [Op.or]: uaerInterest } },
    });
    return tagList;
  };

  buyPage = async () => {
    const tagList = await Tag.findAll();
    return tagList;
  };

  tagBuy = async (userId, tagId, period) => {
    await UserTag.craete({ user_id: userId, tag_id: tagId, period });
  };
}
