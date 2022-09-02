import Tag from "../../models/tag.js";
import User from "../../models/user.js";
import UserTag from "../../models/usertag.js";
import { Op } from "sequelize";

export default new (class TagRepository {
  interest = async (userId) => {
    const userInfo = await User.findOne({ where: { UserId: userId } });
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
    await UserTag.craete({ userId, tagId, period });
  };
})();
