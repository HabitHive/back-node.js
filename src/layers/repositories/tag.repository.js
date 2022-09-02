import UserTag from "../../models/usertag.js";
import Schedule from "../../models/schedule.js";
import Point from "../../models/point.js";
import { Op } from "sequelize";

export default new (class TagRepository {
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

  myAllTagList = async (user_id) => {
    const myTags = await UserTag.findAll({ where: { user_id } });
    return myTags;
  };

  schedule = async (user_tag_id) => {
    const scheduleList = await Schedule.findAll({ where: { user_tag_id } });
    return scheduleList;
  };

  pointHistory = async (user_tag_id) => {
    const history = await Point.findAll({ where: { user_tag_id } });
    return history;
  };
})();
