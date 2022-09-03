import DailyRepository from "../repositories/daily.repository.js";

export default new (class DailyService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  dailyPage = async (userId, todayDate) => {
    const result = await DailyRepository.dailyPage(userId, todayDate);
    const week = todayDate.getDay();
    const dailyTagLists = result.map((list) => {
      if (startDate <= todayDate <= endDate) {
        //현재 날짜의 대해 유효기간안에 있고 (startDate > 현재날짜 < endDate)
        if (list.schedule.week_cycle.includes(week))
          // 현재 날짜의 요일이 weekCycle에 (있으면 보여주거나),(없을면 제거하거나)
          return {
            userTagId: list.user_tag_id,
            tagName: list.Tag.tag_name,
            timeCycle: list.schedule.time_cycle,
          };
      }
    });
    return {
      status: 200,
      result: dailyTagLists,
      message: "날짜에 맞는 태그 일정",
    };
  };

  tagList = async (userId) => {
    const result = await DailyRepository.tagList(userId);
    const tagLists = result.map((list) => {
      return {
        userTagId: list.user_tag_id,
        tagName: list.Tag.tag_name,
        period: list.period,
      };
    });
    return {
      status: 200,
      result: tagLists,
      message: "유저의 태그 목록",
    };
  };

  schedulePage = async (userId, userTagId) => {
    const result = await DailyRepository.schedulePage(userId, userTagId);
    let date = result.startDate;
    let period = result.period / 1;
    // date = new Date(); //현재 시간
    date.setDate(date.getDate() + period);
    return {
      status: 200,
      result: date,
      message: "스케줄의 기간",
    };
  };
  // 지금은 스케줄의 생성에 대한 로직만
  schedule = async (userId, userTagId, timeCycle, weekCycle, startDate) => {
    const userTag = await DailyRepository.userTagInOf(userId, userTagId);
    if (userTag.startDate == null) {
      const period = userTag.period;
      const date = startDate;
      const endDate = date.setDate(date.getDate() + period / 1);
      await this.dailyRepositories.scheduleDate(userTagId, startDate, endDate);
    }
    if (new Date() >= userTag.startDate) {
      // 스케줄 시간이 지난 후에 새로운 스케줄을 설정은?? 지금은 수정 X
      return {
        status: 400,
        result,
        message: "이미 예약한 시간 이후 인데",
      };
    }
    if (userTag.startDate != startDate) {
      const period = userTag.period;
      const date = startDate;
      const endDate = date.setDate(date.getDate() + period / 1);
      await this.dailyRepositories.scheduleDate(userTagId, startDate, endDate);
    } // 나중에 예약을 한 날짜보다 현재날짜를 자났나면 수정불가!

    await this.dailyRepositories.schedule(userTagId, timeCycle, weekCycle);

    return {
      status: 200,
      result,
      message: "내 태그 스케줄 추가",
    };
  };

  scheduleUpdate = async (
    userId,
    scheduleId,
    timeCycle,
    weekCycle,
    todayDate
  ) => {
    const schedule = await DailyRepository.scheduleInOf(scheduleId);
    // 받아온 유저테그의 시작 시간과 현재 시간을 비교해서 시간을 전체적인 시간을 업데이트
    // 현재 시간과 시작시간 비교해 시간이 지났다면 유전태그의 endDate를 todayDate(원하는 날짜)로 바꾸고
    // 그리고 유저 태그를 새로 생성한다.
    if (userTag.startDate != startDate) {
      const period = userTag.period;
      const date = startDate;
      const endDate = date.setDate(date.getDate() + period / 1);
      await this.dailyRepositories.scheduleDate(userTagId, startDate, endDate);
    } // 나중에 예약을 한 날짜보다 현재날짜를 자났나면 수정불가!

    await this.dailyRepositories.schedule(userTagId, timeCycle, weekCycle);

    return {
      status: 200,
      result,
      message: "내 태그 스케줄 추가",
    };
  };
})();
