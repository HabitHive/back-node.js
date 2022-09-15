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
    const doneSchedule = await DailyRepository.doneSchedule(todayDate);
    // 에러가 난다. 작동은 하는 데 (라이크부분에서)
    const doneSchedules = [];
    // [배열로 user_tag_id가 넘오면 ] 나오게 해야한다. 아니면 다른 방법 찾기
    doneSchedule.map((list) => {
      doneSchedules.push(list.user_tag_id);
    });

    // 모든 userId의 스케줄을 다 들고온다. 비효율적임 나중에 해결하자 (X)
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
    // 시간 순서대로 배열 (X)
    const check = await DailyRepository.checkSchedule(userId);
    // 배열로 스케줄들의 user_tag_id가 배열로써 나오게 (O)
    const checkList = [];
    check.map((list) => {
      checkList.push(list.user_tag_id);
    });

    // 유저의 UserTag 모두 가져오기
    const result = await DailyRepository.tagList(userId);
    const tagLists = result.map((list) => {
      if (list.start_date == null) {
        return {
          userTagId: list.user_tag_id,
          tagName: list.Tag.tag_name,
          period: list.period,
          new: !checkList.includes(list.user_tag_id),
          category: list.Tag.category.split("#"),
          date: list.start_date,
        };
      } else {
        return {
          userTagId: list.user_tag_id,
          tagName: list.Tag.tag_name,
          period: list.period,
          new: !checkList.includes(list.user_tag_id),
          category: list.Tag.category.split("#"),
          date:
            list.start_date.split(" ")[0] + " ~ " + list.end_date.split(" ")[0],
        };
      }
    });
    return {
      status: 200,
      result: tagLists,
      message: "유저의 태그 목록",
    };
  };

  schedulePage = async (userId, userTagId) => {
    const result = await DailyRepository.schedulePage(userId, userTagId);
    let date = `${result.startDate}~${result.endDate}`;

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
    console.log(userTag.start_date);
    if (userTag.start_date == null) {
      const period = userTag.period;
      let date = new Date(startDate);
      date.setDate(date.getDate() + period);
      let endDate = date
        .toLocaleDateString()
        .split(". ")
        .join("-")
        .slice(0, -1);
      await DailyRepository.startDateUpdate(userTagId, startDate, endDate);
    } else {
      if (new Date() >= new Date(userTag.start_date)) {
        return {
          status: 403,
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
        await DailyRepository.startDateUpdate(userTagId, startDate, endDate);
      }
    }

    const timeCycle = startTime + "," + endTime;

    await DailyRepository.schedule(userTagId, userId, timeCycle, weekCycle);

    return {
      status: 200,
      result: {},
      message: "내 태그 스케줄 추가",
    };
  };

  scheduleUpdate = async (
    // 스케줄을 선택하고 수정할 때 원래 있던 스케줄 수정
    userId,
    scheduleId,
    startTime,
    endTime,
    weekCycle,
    startDate
  ) => {
    // 스케줄 시간이 지난 후에 새로운 스케줄을 설정은?? 지금은 수정 X

    const schedule = await DailyRepository.scheduleInOf(userId, scheduleId);
    // 유저의가 선택한 태그의 정보

    if (new Date() >= new Date(schedule.UserTag.start_date)) {
      return {
        status: 403,
        result: {},
        message: "이미 예약한 시간 이후 인데",
      }; // 나중에 예약을 한 날짜보다 현재날짜를 자났나면 수정불가! (O)
    }

    const userTagId = schedule.UserTag.user_tag_id;

    if (schedule.UserTag.startDate != startDate) {
      const period = schedule.userTag.period;
      let date = new Date(startDate);
      date.setDate(date.getDate() + period);
      let endDate = date
        .toLocaleDateString()
        .split(". ")
        .join("-")
        .slice(0, -1);
      await DailyRepository.startDateUpdate(userTagId, startDate, endDate);
    }

    const timeCycle = startTime + "," + endTime;

    await DailyRepository.scheduleUpdate(scheduleId, timeCycle, weekCycle);

    return {
      status: 200,
      result: {},
      message: "내 태그 스케줄 추가",
    };
  };
})();
