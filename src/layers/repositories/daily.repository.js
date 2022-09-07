import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";
import Schedule from "../../models/schedule.js";

export default new (class DailyRepository {
  dailyPage = async (user_id) => {
    const dailyTagLists = await UserTag.findAll({
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
    return dailyTagLists;
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
    const tag = await UserTag.findOne({ where: { user_id, user_tag_id } });
    return tag;
  };

  userTagInOf = async (user_id, user_tag_id) => {
    const userTag = await UserTag.findOne({ where: { user_id, user_tag_id } });
    return userTag;
  };

  scheduleDate = async (user_tag_id, start_date, end_date) => {
    await UserTag.update({ start_date, end_date }, { where: { user_tag_id } });
  };

  schedule = async (user_tag_id, time_cycle, week_cycle) => {
    await Schedule.create({ user_tag_id, time_cycle, week_cycle });
  };

  scheduleInOf = async (schedule_id) => {
    const schedule = await Schedule.findOne({ where: { schedule_id } });
    return schedule;
  };
})();
