import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";
import Schedule from "../../models/schedule.js";
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
    const myTags = await UserTag.findAll({
      where: { user_id },
      order: [["end_date", "DESC"]],
    });
    return myTags;
  };

  schedule = async (user_tag_id) => {
    const scheduleList = await Schedule.findAll({ where: { user_tag_id } });
    return scheduleList;
  };

  dailyPage = async (userId, todayDate) => {
    const myDailyPage = await UserTag.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Tag,
          attributes: ["tag_name"],
        },
        {
          model: Schedule,
          attributes: ["time_cycle", "week_cycle"],
        },
      ],
    });
    return myDailyPage;
  };

  tagList = async (userId) => {
    const myTagList = await UserTag.findAll({
      where: { user_id: userId },
      include: {
        model: Tag,
        attributes: ["tag_name"],
      },
    });
    return myTagList;
  };

  schedulePage = async (userId, userTagId) => {
    const tag = await UserTag.findOne({
      where: { user_id: userId, user_tag_id: userTagId },
    });
    return tag;
  };

  userTagInOf = async (userId, userTagId) => {
    const userTag = await UserTag.findOne({
      where: { user_id: userId, user_tag_id: userTagId },
    });
    return userTag;
  };

  scheduleDate = async (userTagId, startDate, endDate) => {
    await UserTag.update(
      { start_date: startDate, end_date: endDate },
      { where: { user_tag_id: userTagId } }
    );
  };

  schedule = async (userId, userTagId, timeCycle, weekCycle) => {
    await Schedule.craete({
      user_tag_id: userTagId,
      time_cycle: timeCycle,
      week_cycle: weekCycle,
    });
  };

  isSuccess = async (user_tag_id, success) => {
    const result = await UserTag.update(
      { success },
      { where: { user_tag_id } }
    );
  };
})();
