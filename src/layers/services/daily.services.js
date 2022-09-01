import DailyRepositories from "../repositories/daily.repository.js";

export default class dailyServices {
  dailyRepositories = new DailyRepositories();

  dailyPage = async (userId, todayDate) => {
    const result = await this.dailyRepositories.dailyPage(userId, todayDate);
    // let startDate = new Date();
    // let endDate = new Date();
    // startDate.setDate(startDate.getDate() + 30);
    // endDate.setDate(endDate.getDate() - 30);
    // todayDate.setDate(todayDate.getDate() - 4)
    const dailyTagLists = result.map((list) => {
      if (list.startDate <= todayDate <= list.endDate) {
        if (list.schedule.weekCycle.includes(todayDate.getDay())) {
          console.log(list.schedule.weekCycle.includes(todayDate.getDay())); //나중에 weekCycle 로 제한 하기&& todayDate.getDay()
          return {
            userTagId: list.id,
            tagName: list.Tag.tagName,
            scheduleId: list.schedule.id,
            timeCycle: list.schedule.timeCycle,
          };
        }
      }
    });
    //현재 날짜의 대해 유효기간안에 있고 (startDate > 현재날짜 < endDate)
    // 현재 날짜의 요일이 weekCycle에 (있으면 보여주거나),(없을면 제거하거나)
    return dailyTagLists;
  };

  tagList = async (userId) => {
    const result = await this.dailyRepositories.tagList(userId);
    const tagLists = result.map((list) => {
      // let date = list.startDate;
      // date = new Date(2019, 0, 31);
      // date.setDate(date.getDate() + 30);
      // console.log(date); //< Number(list.endDate)//나중에 유효기간에 따라
      return {
        userTagId: list.id,
        tagName: list.Tag.tagName,
        period: list.period,
      };
    });
    return tagLists;
  };

  schedulePage = async (userId, userTagId) => {
    const result = await this.dailyRepositories.schedulePage(userId, userTagId);
    // let date = result.startDate;
    // let period = result.period / 1;
    // // date = new Date(); //현재 시간
    // date.setDate(date.getDate() + period);
    return result;
  };

  schedule = async (userId, userTagId, startDate, timeCycle, weekCycle) => {
    // 스케줄 처음 생성만 고려; 나중에 수정할때 시작시간과 현제시간의 문제 잘 생각하기
    const tagCheck = await this.dailyRepositories.scheduleTagCheck(
      userId,
      userTagId
    );
    let date = result.startDate;
    const period = tagCheck.period / 1;
    const endDate = date.setDate(date.getDate() + period);
    await this.dailyRepositories.scheduleStartDate(
      userId,
      userTagId,
      startDate,
      endDate
    );
    await this.dailyRepositories.schedule(userTagId, timeCycle, weekCycle);
  };
}
