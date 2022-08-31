import Dailyrepositories from "../repositories/daily.repository.js";

class dailyservices {
  dailyrepositories = new Dailyrepositories();

  dailypage = async (userId, todayDate) => {
    const result = await this.dailyrepositories.dailypage(userId, todayDate);
    // let startDate = new Date();
    // let endDate = new Date();
    // startDate.setDate(startDate.getDate() + 30);
    // endDate.setDate(endDate.getDate() - 30);
    // todayDate.setDate(todayDate.getDate() - 4)
    const dailytaglists = result.map((list) => {
      if (todayDate <= todayDate <= todayDate && todayDate.getDay()) {
        console.log(todayDate.getDay()); //나중에 weekCycle 로 제한 하기
        return {
          usertagId: list.id,
          tagname: list.Tag.tagname,
          // timeCycle: list.schedule.timeCycle,
        };
      }
    });
    //현재 날짜의 대해 유효기간안에 있고 (startDate > 현재날짜 < endDate)
    // 현재 날짜의 요일이 weekCycle에 (있으면 보여주거나),(없을면 제거하거나)
    return dailytaglists;
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

export default dailyservices;
