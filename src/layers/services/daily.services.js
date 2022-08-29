import Dailyrepositories from "../repositories/daily.repository.js";

class dailycontroller {
  dailyrepositories = new Dailyrepositories();

  dailypage = async (userId, todayDate) => {
    const result = await this.dailyrepositories.dailypage(userId, todayDate);

    return result;
  };

  taglist = async (userId) => {
    const result = await this.dailyrepositories.taglist(userId);

    return result;
  };
}

export default dailycontroller;
