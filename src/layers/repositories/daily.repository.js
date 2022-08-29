import UserTag from "../../models/usertag";
import Tag from "../../models/tag.js";

class dailycontroller {
  dailypage = async (userId, todayDate) => {
    const mydailypage = await UserTag.findAll({ where: { userId } });
  };

  taglist = async (userId) => {
    const mytaglist = await UserTag.findAll({ where: { userId } });
  };
}

export default dailycontroller;
