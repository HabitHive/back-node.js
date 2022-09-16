import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";
import Schedule from "../../models/schedule.js";
import { Op } from "sequelize";
import Done from "../../models/done.js";

export default new (class DailyRepository {
  doneSchedule = async (toDate) => {
    let lastDate = new Date(toDate);
    new Date(lastDate.setDate(lastDate.getDate() - 1)); // 정시인 00시에서 1일 지난 00시 만들기

    const doneSchedules = await Done.findAll({
      where: { date: { [Op.lte]: toDate, [Op.gt]: lastDate } }, // toDate =< date , date =< lastDate
      attributes: ["user_tag_id"],
    });
    return doneSchedules;
  };

  dailyPage = async (user_id, toDate) => {
    const dailyTagLists = await Schedule.findAll({
      where: { user_id },
      include: {
        model: UserTag,
        where: {
          start_date: { [Op.lte]: toDate }, // start_date =< toDate
          end_date: { [Op.gt]: toDate }, // toDate < end_date
        },
        include: [
          {
            model: Tag,
            attributes: ["tag_name", "category"],
          },
        ],
      },
    });
    return dailyTagLists;
  };

  checkSchedule = async (user_id) => {
    const newcheck = await Schedule.findAll({
      attributes: ["user_tag_id"],
      where: { user_id },
    });
    return newcheck;
  };

  tagList = async (user_id) => {
    const myTagList = await UserTag.findAll({
      order: [["createdAt", "desc"]], // 정렬할 컬럼명과 오름차순/내림차순 구분
      where: { user_id },
      include: {
        model: Tag,
        attributes: ["tag_name", "category"],
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

  startDateUpdate = async (user_tag_id, start_date, end_date) => {
    await UserTag.update({ start_date, end_date }, { where: { user_tag_id } });
  };

  schedule = async (user_tag_id, user_id, time_cycle, week_cycle) => {
    await Schedule.create({ user_tag_id, user_id, time_cycle, week_cycle });
  };

  scheduleInOf = async (user_id, schedule_id) => {
    const schedule = await Schedule.findOne({
      where: { user_id, schedule_id },
      include: {
        model: UserTag,
        attributes: ["user_tag_id", "start_date", "period"],
      },
    });
    return schedule;
  };

  scheduleUpdate = async (schedule_id, time_cycle, week_cycle) => {
    await Schedule.update(
      { time_cycle, week_cycle },
      { where: { schedule_id } }
    );
  };

  scheduleDelete = async (user_id, schedule_id) => {
    await Schedule.destroy({ where: { user_id, schedule_id } });
    return;
  };
})();
