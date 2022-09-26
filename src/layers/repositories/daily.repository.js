const UserTag = require("../../models/usertag");
const Tag = require("../../models/tag");
const Schedule = require("../../models/schedule");
const { Op } = require("sequelize");
const Done = require("../../models/done");

module.exports = new (class DailyRepository {
  doneSchedule = async (user_id, toDate) => {
    let lastDate = new Date(toDate);
    new Date(lastDate.setDate(lastDate.getDate() - 1)); // 정시인 00시에서 1일 지난 00시 만들기

    return await Done.findAll({
      where: { user_id, date: { [Op.lte]: toDate, [Op.gt]: lastDate } }, // toDate =< date , date =< lastDate
      attributes: ["schedule_id"],
      raw: true,
    });
  };

  dailyPage = async (user_id, toDate) => {
    return await Schedule.findAll({
      where: { user_id },
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
  };

  checkSchedule = async (user_id) => {
    return await Schedule.findAll({
      attributes: ["user_tag_id"],
      where: { user_id },
      raw: true,
    });
  };

  tagList = async (user_id, date) => {
    return await UserTag.findAll({
      order: [["createdAt", "desc"]], // 정렬할 컬럼명과 오름차순/내림차순 구분
      where: {
        user_id,
        end_date: { [Op.or]: { [Op.gt]: date, [Op.eq]: null } },
      }, // date < end_date or end_date = null
      include: [
        {
          model: Tag,
          attributes: ["tag_name", "category"],
        },
      ],
      raw: true,
    });
  };

  schedulePage = async (user_id, user_tag_id) => {
    return await UserTag.findOne({
      where: { user_id, user_tag_id },
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
