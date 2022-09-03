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
    //uaerInterest[1],uaerInterest[2],uaerInterest[3]
    const tagList1 = await Tag.findAll({
      where: { category: { [Op.like]: `%${uaerInterest[1]}%` } },
    });
    const tagList2 = await Tag.findAll({
      where: { category: { [Op.like]: `%${uaerInterest[2]}%` } },
    });
    const tagList3 = await Tag.findAll({
      where: { category: { [Op.like]: `%${uaerInterest[3]}%` } },
    });
    // console.log(tagList1.tag_id, "!!!!!!!!!!!");
    // console.log(tagList2.tag_id, "%%%%%%%%%%%");
    // console.log(tagList3.tag_id, "@@@@@@@@@@@");
    return { tagList1, tagList2, tagList3 };
  };

  buyPage = async () => {
    const tagList = await Tag.findAll();
    return tagList;
  };

  tagBuy = async (userId, tagId, period) => {
    await UserTag.craete({ user_id: userId, tag_id: tagId, period });
  };
}
