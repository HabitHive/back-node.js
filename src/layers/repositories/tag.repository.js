import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";
import Schedule from "../../models/schedule.js";
import { Op } from "sequelize";
import User from "../../models/user.js";
import Done from "../../models/done.js";

export default new (class TagRepository {
  userInterest = async (user_id) => {
    return await User.findOne({
      attributes: ["interest", "point"],
      where: { user_id },
    });
  };

  userBuyList = async (user_id) => {
    return await UserTag.findAll({
      attributes: ["tag_id"],
      where: { user_id },
    });
  };

  tagAllList = async () => {
    return await Tag.findAll();
  };

  recommended = async (categoryCount, userInterest) => {
    let tagList = [];
    for (let i = 0; i < categoryCount; i++) {
      const list = await Tag.findAll({
        where: { category: { [Op.like]: `%${userInterest[i]}%` } },
      });
      tagList.push(list);
    }
    return tagList;
  };

  tagBuy = async (user_id, tag_id, period, point) => {
    await UserTag.create({ user_id, tag_id, period });
    await User.update({ point }, { where: { user_id } });
  };

  myAllTagList = async (user_id) => {
    const myTags = await UserTag.findAll({
      where: { user_id },
      order: [["end_date", "DESC"]],
      include: [{ model: Tag, attributes: ["tag_name"] }],
      raw: true,
    });
    return myTags;
  };

  findUserTag = async (user_tag_id) => {
    const tag = await UserTag.findOne({ where: { user_tag_id } });
    return tag;
  };

  schedule = async (user_tag_id) => {
    const scheduleList = await Schedule.findAll({ where: { user_tag_id } });
    return scheduleList;
  };

  dailyPage = async (user_id, todayDate) => {
    const myDailyPage = await UserTag.findAll({
      where: { user_id },
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

  tagList = async (user_id) => {
    const myTagList = await UserTag.findAll({
      where: { user_id },
      include: {
        model: Tag,
        attributes: ["tag_name"],
      },
    });
    return myTagList;
  };

  schedulePage = async (user_id, user_tag_id) => {
    const tag = await UserTag.findOne({
      where: { user_id, user_tag_id },
    });
    return tag;
  };

  userTagInOf = async (user_id, user_tag_id) => {
    const userTag = await UserTag.findOne({
      where: { user_id, user_tag_id },
    });
    return userTag;
  };

  scheduleDate = async (user_tag_id, start_date, end_date) => {
    await UserTag.update({ start_date, end_date }, { where: { user_tag_id } });
  };

  findSchedule = async (schedule_id) => {
    const schedule = await Schedule.findOne({
      where: { schedule_id },
      include: [{ model: UserTag, attributes: ["user_id"] }],
    });
    return schedule;
  };

  isSuccess = async (user_tag_id, success) => {
    const result = await UserTag.update(
      { success },
      { where: { user_tag_id } }
    );
    console.log(result);
    return result;
  };

  createDone = async (user_id, user_tag_id, date, time_cycle) => {
    const result = await Done.create({
      user_id,
      user_tag_id,
      date,
      time_cycle,
    });
    return result;
  };
})();
