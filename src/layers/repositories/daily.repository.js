const UserTag = require("../../models/usertag");
const Tag = require("../../models/tag");
const Schedule = require("../../models/schedule");
const { Op } = require("sequelize");
const Done = require("../../models/done");

module.exports = new (class DailyRepository {
  doneSchedule = async (user_id, toDate) => {
    return await Done.findAll({
      where: { user_id, date: { [Op.eq]: toDate } }, // toDate =< date , date < lastDate
      attributes: ["schedule_id"],
      raw: true,
    });
  };

  dailyPage = async (user_id, toDate) => {
    return await Schedule.findAll({
      where: { user_id },
      order: [["time_cycle", "ASC"]], // 정렬할 컬럼명과 오름차순 구분
      attributes: [
        "schedule_id",
        "user_tag_id",
        "time_cycle",
        "week_cycle",
        "after_date",
      ],
      raw: true,
      include: {
        model: UserTag,
        attributes: ["period", "start_date", "end_date"],
        where: {
          start_date: { [Op.lte]: toDate }, // start_date <= toDate
          end_date: { [Op.gte]: toDate }, // toDate <= end_date
        },
        include: [
          {
            model: Tag,
            attributes: ["tag_name", "category", "color"],
          },
        ],
      },
    });
  };

  checkSchedule = async (user_id) => {
    return await Schedule.findAll({
      attributes: ["user_tag_id"],
      where: { user_id },
      raw: true,
    });
  };

  tagList = async (user_id, lastDate) => {
    return await UserTag.findAll({
      order: [["createdAt", "desc"]], // 정렬할 컬럼명과 내림차순 구분
      where: {
        user_id,
        end_date: { [Op.or]: { [Op.gte]: lastDate, [Op.eq]: null } },
      }, // lastDate < end_date or end_date = null
      include: [
        {
          model: Tag,
          attributes: ["tag_name", "category", "color"],
        },
      ],
      raw: true,
    });
  };

  userTagInOf = async (user_id, user_tag_id) => {
    return await UserTag.findOne({
      attributes: ["start_date", "period"],
      where: { user_id, user_tag_id },
      raw: true,
    });
  };

  startDateUpdate = async (user_tag_id, start_date, end_date) => {
    await UserTag.update({ start_date, end_date }, { where: { user_tag_id } });
  };

  schedule = async (
    user_tag_id,
    user_id,
    time_cycle,
    week_cycle,
    after_date
  ) => {
    await Schedule.create({
      user_tag_id,
      user_id,
      time_cycle,
      week_cycle,
      after_date,
    });
  };

  scheduleInOf = async (user_id, schedule_id) => {
    const schedule = await Schedule.findOne({
      where: { user_id, schedule_id },
      raw: true,
      include: {
        model: UserTag,
        attributes: ["user_tag_id", "start_date", "period"],
      },
    });
    return schedule;
  };

  scheduleUpdate = async (schedule_id, time_cycle, week_cycle, after_date) => {
    await Schedule.update(
      { time_cycle, week_cycle, after_date },
      { where: { schedule_id } }
    );
  };

  scheduleDelete = async (user_id, schedule_id) => {
    await Schedule.destroy({ where: { user_id, schedule_id } });
    return;
  };
})();
