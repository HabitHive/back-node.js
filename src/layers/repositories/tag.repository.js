import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";

export default new (class TagRepository {
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

  findOneUserTag = async () => {
    const tag = await UserTag.findOne({ where: {} });
    return;
  };
  findOneDoneTag = async () => {
    const tag = await Tag.findOne({ where: {} });
    return;
  };
  findAllUserTag = async () => {
    const tag = await UserTag.findAll({ where: {} });
    return;
  };
  findAllDoneTag = async () => {
    const tag = await Tag.findAll({ where: {} });
    return;
  };
})();
