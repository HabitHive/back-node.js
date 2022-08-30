import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";

class dailycontroller {
  dailypage = async (userId, todayDate) => {
    const mydailypage = await UserTag.findAll({ where: { userId } });
  };

  taglist = async (userId) => {
    const mytaglist = await UserTag.findAll({
      where: { UserUserId: userId },
      include: {
        model: Tag,
        attributes: ["tagname"],
      },
    });
    return mytaglist;
  };

  schedulepage = async (userId, usertagId) => {
    const tag = await UserTag.findOne({
      where: { id: usertagId, UserUserId: userId },
    });
    return tag;
  };

  schedule = async (userId, usertagId, currentDate) => {
    const tag = await UserTag.findOne({ where: { userId, usertagId } });
    await Schedule.craete(
      { timeCycle, weekCycle },
      { where: { userId, usertagId } }
    );
  };
}

export default dailycontroller;
