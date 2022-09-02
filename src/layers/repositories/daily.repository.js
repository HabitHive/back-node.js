import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";
import Schedule from "../../models/schedule.js";

export default new (class DailyRepository {
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
})();
