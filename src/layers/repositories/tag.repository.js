import Tag from "../../models/tag.js";
import User from "../../models/user.js";
import UserTag from "../../models/usertag.js";

export default class tagRepositories {
  interest = async (userId) => {
    const userInfo = await User.findOne({ where: { userId } });
    return userInfo;
  };

  buyPage = async () => {
    const tagList = await Tag.findAll();
    return tagList;
  };

  tagBuy = async (userId, tagId, period, startDate, endDate) => {
    await UserTag.craete({ userId, tagId, period, startDate, endDate });
  };
}
