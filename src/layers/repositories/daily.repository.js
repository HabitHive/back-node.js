import UserTag from "../../models/usertag";
import Tag from "../../models/tag.js";

class dailycontroller {
  dailypage = async (userId, todayDate) => {
    const mydailypage = await UserTag.findAll(userId);
  };
}

export default dailycontroller;
