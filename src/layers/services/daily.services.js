import Dailyrepositories from "../repositories/daily.repository.js";

class dailycontroller {
  dailyrepositories = new Dailyrepositories();

  dailypage = async (userId, todayDate) => {
    const result = await this.dailyrepositories.dailypage(userId, todayDate);

    return result;
  };

  taglist = async (userId) => {
    const result = await this.dailyrepositories.taglist(userId);
    const taglists = result.map((list) => {
      // let date = list.startDate;
      // date = new Date(2019, 0, 31);
      // date.setDate(date.getDate() + 30);
      // console.log(date); //< Number(list.endDate)//나중에 유효기간에 따라
      return {
        usertagId: list.id,
        tagname: list.Tag.tagname,
        period: list.period, // 남은 날짜에 따른 값을 확인해서 배출
      };
    });
    return taglists;
  };

  schedulepage = async (userId, usertagId) => {
    const result = await this.dailyrepositories.schedulepage(userId, usertagId);
    let date = result.startDate;
    let period = result.period / 1;
    // date = new Date(); //현재 시간
    date.setDate(date.getDate() + period);
    return date;
  };

  schedule = async (userId, usertagId, timeCycle, weekCycle) => {
    const result = await this.dailyrepositories.schedule(
      userId,
      usertagId,
      timeCycle,
      weekCycle
    );

    return result;
  };
}

export default dailycontroller;
