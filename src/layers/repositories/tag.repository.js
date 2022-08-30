import Tag from "../../models/tag.js";
import User from "../../models/user.js";
import UserTag from "../../models/usertag.js";

class tagrepositories {
  interest = async (userId) => {
    const interests = await User.findOne({ where: { userId } });
    return interests;
  };

  buypage = async () => {
    const taglist = await Tag.findAll();
    return taglist;
  };

  tagbuy = async (userId, tagId, period, startDate, endDate) => {
    await UserTag.craete({ userId, tagId, period, startDate, endDate });
  };
}

export default tagrepositories;
