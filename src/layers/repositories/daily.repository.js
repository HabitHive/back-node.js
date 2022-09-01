import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";
import Schedule from "../../models/schedule.js";

export default class dailyRepositories {
  dailyPage = async (userId, todayDate) => {
    const myDailyPage = await UserTag.findAll({
      where: { UserUserId: userId },
      include: [
        {
          model: Tag,
          attributes: ["tagName"],
        },
        {
          model: Schedule,
          attributes: ["timeCycle", "weekCycle"],
        },
      ],
    });
    return myDailyPage;
  };

  tagList = async (userId) => {
    const myTagList = await UserTag.findAll({
      where: { UserUserId: userId },
      include: {
        model: Tag,
        attributes: ["tagName"],
      },
    });
    return myTagList;
  };

  schedulePage = async (userId, userTagId) => {
    // 에러가 나면 userTagId가 없거나, 해당 유저의 것이 아닐 때
    const tag = await UserTag.findOne({
      where: { id: userTagId, UserUserId: userId },
      include: {
        model: Schedule,
        attributes: ["startDate", "endDate", "timeCycle", "weekCycle"],
      },
    });
    return tag;
  };

  scheduleTagCheck = async (userId, userTagId) => {
    const tagCheck = await UserTag.findOne({
      where: { id: userTagId, UserUserId: userId },
    });
    return tagCheck;
  };

  scheduleStartDate = async (userId, userTagId, startDate, endDate) => {
    await UserTag.update(
      { startDate, endDate },
      { UserUserId: userId, id: userTagId }
    );
  };

  schedule = async (userTagId, timeCycle, weekCycle) => {
    await Schedule.craete({ UserTagId: userTagId, timeCycle, weekCycle });
  };
}
