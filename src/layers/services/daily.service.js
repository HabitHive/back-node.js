import DailyRepository from "../repositories/daily.repository.js";

export default new (class DailyService {
  dailyPage = async (userId, todayDate) => {
    const result = await DailyRepository.dailyPage(userId, todayDate);
    // let startDate = new Date();
    // let endDate = new Date();
    // startDate.setDate(startDate.getDate() + 30);
    // endDate.setDate(endDate.getDate() - 30);
    // todayDate.setDate(todayDate.getDate() - 4)
    const dailyTagLists = result.map((list) => {
      if (todayDate <= todayDate <= todayDate) {
        console.log(todayDate.getDay()); //나중에 weekCycle 로 제한 하기&& todayDate.getDay()
        return {
          userTagId: list.user_tag_id,
          tagName: list.Tag.tag_name,
          // timeCycle: list.schedule.timeCycle,
        };
      }
    });
    //현재 날짜의 대해 유효기간안에 있고 (startDate > 현재날짜 < endDate)
    // 현재 날짜의 요일이 weekCycle에 (있으면 보여주거나),(없을면 제거하거나)
    return dailyTagLists;
  };

  tagList = async (userId) => {
    const result = await DailyRepository.tagList(userId);
    const tagLists = result.map((list) => {
      // let date = list.startDate;
      // date = new Date(2019, 0, 31);
      // date.setDate(date.getDate() + 30);
      // console.log(date); //< Number(list.endDate)//나중에 유효기간에 따라
      return {
        userTagId: list.user_tag_id,
        tagName: list.Tag.tag_name,
        period: list.period, // 남은 날짜에 따른 값을 확인해서 배출
      };
    });
    return tagLists;
  };

  schedulePage = async (userId, userTagId) => {
    const result = await DailyRepository.schedulePage(userId, userTagId);
    let date = result.startDate;
    let period = result.period / 1;
    // date = new Date(); //현재 시간
    date.setDate(date.getDate() + period);
    return date;
  };

  schedule = async (userId, userTagId, timeCycle, weekCycle, startDate) => {
    const result = await this.dailyRepositories.userTagInOf(userId, userTagId);
    if (result.startDate != startDate) {
      const period = result.period;
      const date = startDate;
      const endDate = date.setDate(date.getDate() + period);
      await this.dailyRepositories.scheduleDate(userTagId, startDate, endDate);
    } // 나중에 예약을 한 날짜보다 현재날짜를 자났나면 수정불가!

    await this.dailyRepositories.schedule(
      userId,
      userTagId,
      timeCycle,
      weekCycle
    );

    return;
  };
})();
