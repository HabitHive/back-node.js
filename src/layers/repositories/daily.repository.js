import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";
import Schedule from "../../models/schedule.js";
import Done from "../../models/done.js";

export default new (class DailyRepository {
  doneSchedule = async (todayDate) => {
    const doneSchedules = await Done.findAll({
      where: { date: { [Op.like]: `%${todayDate}%` } },
      attributes: ["user_tag_id"],
    });
    return doneSchedules;
  };

  dailyPage = async (user_id) => {
    const dailyTagLists = await Schedule.findAll({
      where: { user_id },
      include: {
        model: UserTag,
        attributes: ["start_date", "end_date"],
        include: [
          {
            model: Tag,
            attributes: ["tag_name"],
          },
        ],
      },
    });
    return dailyTagLists;
  };

  checkSchedule = async (user_id) => {
    const newcheck = await Schedule.findAll({
      where: { user_id },
      attributes: ["user_tag_id"],
    });
    return newcheck;
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
