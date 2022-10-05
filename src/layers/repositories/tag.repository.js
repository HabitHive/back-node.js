const UserTag = require("../../models/usertag");
const Tag = require("../../models/tag");
const Schedule = require("../../models/schedule");
const { Op } = require("sequelize");
const User = require("../../models/user");
const Done = require("../../models/done");

module.exports = new (class TagRepository {
  userInterest = async (user_id) => {
    return await User.findOne({
      attributes: ["interest", "point"],
      where: { user_id },
      raw: true,
    });
  };

  userBuyList = async (user_id, lastDate) => {
    return await UserTag.findAll({
      attributes: ["tag_id"],
      where: {
        user_id,
        end_date: { [Op.or]: { [Op.gt]: lastDate, [Op.eq]: null } },
      },
      raw: true,
    });
  };

  tagAllList = async (user_id, attention) => {
    return await Tag.findAll({
      // order: [["category", "DESC"]],
      // order: [sequelize.fn("otherfunction", sequelize.col("myhabit")), "DESC"],
      where: {
        user_id: { [Op.or]: [user_id, null] },
        category: { [Op.like]: `%${attention}%` },
      }, // 선택한 관심 목록을 불러오기 위한
      raw: true,
    });
  };

  recommended = async (user_id, categoryCount, userInterest) => {
    let tagList = [];
    for (let i = 0; i < categoryCount; i++) {
      const list = await Tag.findAll({
        user_id: { [Op.or]: [user_id, null] },
        where: { category: { [Op.like]: `%${userInterest[i]}%` } },
        raw: true,
      });
      tagList.push(list);
    }
    return tagList;
  };

  tagBuy = async (user_id, tag_id, period, point, lastDate) => {
    return await UserTag.findOrCreate({
      where: {
        user_id,
        tag_id,
        end_date: { [Op.or]: { [Op.gt]: lastDate, [Op.eq]: null } },
      },
      defaults: { user_id, tag_id, period, end_date: null },
    }).then(([save, created]) => {
      if (!created) {
        return "잘못된 요청";
      } else {
        User.update({ point }, { where: { user_id } });
      }
    });
  };

  mytagCreate = async (user_id, tag_name, category, color) => {
    return await Tag.findOrCreate({
      where: {
        user_id,
        tag_name,
        category,
        color,
      },
      raw: true,
    }).then(([save, created]) => {
      if (!created) {
        return save;
      } else {
        return save;
      }
    });
  };

  tagCheck = async (tag_id) => {
    return await Tag.findOne({
      where: { tag_id },
      attributes: ["user_id", "tag_name"],
      raw: true,
    });
  };

  mytagDelete = async (user_id, tag_id) => {
    await Tag.update({ user_id: -user_id }, { where: { user_id, tag_id } });
  };

  myAllTagList = async (user_id) => {
    const myTags = await UserTag.findAll({
      where: { user_id },
      order: [["end_date", "DESC"]],
      include: [{ model: Tag, attributes: ["tag_name", "color"] }],
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
      raw: true,
    });
    return schedule;
  };

  isSuccess = async (user_tag_id, success) => {
    const result = await UserTag.update(
      { success },
      { where: { user_tag_id } }
    );
    return result;
  };

  createDone = async (user_id, schedule_id, user_tag_id, date, time_cycle) => {
    const result = await Done.create({
      user_id,
      schedule_id,
      user_tag_id,
      date,
    });
    return result;
  };
})();
