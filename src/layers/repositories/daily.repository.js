import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";
import Schedule from "../../models/schedule.js";

export default new (class DailyRepository {
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
    const tag = await UserTag.findOne({
      where: { id: userTagId, UserUserId: userId },
    });
    return tag;
  };

  schedule = async (userId, usertagId, timeCycle, weekCycle) => {
    await Schedule.create({ timeCycle, weekCycle, UserTagId: usertagId });
  };
})();
