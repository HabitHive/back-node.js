import DailyRepository from "../repositories/daily.repository.js";

export default new (class DailyService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  dailyPage = async (userId, todayDate) => {
    // 완료된 스케줄 만들 요소 Done 만들기 (아직)
    let week = new Date(todayDate).getDay();
    if (isNaN(week)) {
      return {
        status: 400,
        result: todayDate,
        message: "날짜 형식이 맞아?",
      };
    }
    // 해당 날짜의 스케줄 중에 완료된 것들 목록
    const doneSchedules = await DailyRepository.doneSchedule(todayDate);
    // [배열로 user_tag_id가 넘오면 ] 나오게 해야한다. 아니면 다른 방법 찾기

    // 모든 userId의 스케줄을 다 들고온다. 비효율적임 나중에 해결(X)
    const result = await DailyRepository.dailyPage(userId);

    const dailyTagLists = result.map((list) => {
      if (list.UserTag.start_date != null) {
        if (
          new Date(list.UserTag.start_date) <= new Date(todayDate) &&
          new Date(todayDate) <= new Date(list.UserTag.end_date)
        ) {
          //현재 날짜의 대해 유효기간안에 있고 (startDate > 현재날짜 < endDate)
          if (list.week_cycle.includes(week))
            // 현재 날짜의 요일이 weekCycle에 (있으면 보여주거나),(없을면 제거하거나)
            return {
              scheduleId: list.schedule_id,
              userTagId: list.user_tag_id,
              weekCycle: list.time_cycle,
              tagName: list.UserTag.Tag.tag_name,
              category: list.UserTag.Tag.category.split("#"),
              done: doneSchedules.includes(list.user_tag_id),
            };
        }
      }
    });

    const dailyTagList = dailyTagLists.filter(function (check) {
      return check !== undefined;
    });

    return {
      status: 200,
      result: dailyTagList,
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

  schedule = async (
    userId,
    userTagId,
    startTime,
    endTime,
    weekCycle,
    startDate
  ) => {
    // 스케줄 시간이 지난 후에 새로운 스케줄을 설정은?? 지금은 수정 X
    const userTag = await DailyRepository.userTagInOf(userId, userTagId);
    console.log(userTag);
    if (userTag.start_date == null) {
      const period = userTag.period;
      let date = new Date(startDate);
      date.setDate(date.getDate() + period);
      let endDate = date
        .toLocaleDateString()
        .split(". ")
        .join("-")
        .slice(0, -1);
      await DailyRepository.scheduleDate(userTagId, startDate, endDate);
    } else {
      if (new Date() >= new Date(userTag.start_date)) {
        return {
          status: 400,
          result: {},
          message: "이미 예약한 시간 이후 인데",
        }; // 나중에 예약을 한 날짜보다 현재날짜를 자났나면 수정불가! (O)
      }

      if (userTag.startDate != startDate) {
        const period = userTag.period;
        let date = new Date(startDate);
        date.setDate(date.getDate() + period);
        let endDate = date
          .toLocaleDateString()
          .split(". ")
          .join("-")
          .slice(0, -1);
        await DailyRepository.scheduleDate(userTagId, startDate, endDate);
      }
    }

    const timeCycle = startTime + "," + endTime;
    console.log(timeCycle);
    await DailyRepository.schedule(userTagId, timeCycle, weekCycle);

    return {
      status: 200,
      result: {},
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
