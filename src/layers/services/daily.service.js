import DailyRepository from "../repositories/daily.repository.js";
import translation from "../utils/translation.category.js";

export default new (class DailyService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  dailyPage = async (userId, todayDate) => {
    let toDate = new Date(todayDate);
    let week = toDate.getDay();
    if (isNaN(week)) {
      return {
        status: 400,
        result: todayDate,
        message: "날짜 형식이 맞아?",
      };
    } // 날짜형식이 아니면 걸린다.

    let dailyTagList = await DailyRepository.dailyPage(userId, toDate);
    // 스케줄의 시작날짜 마지막 날짜안에 todayDate가 있는지 확인하고 가져온다.(O)

    dailyTagList = dailyTagList.filter((check) =>
      check.week_cycle.includes(week)
    ); // 날짜에 맞추어 들고온 스케줄의 요알에 맞는지 필터 (O)

    const doneSchedule = await DailyRepository.doneSchedule(toDate);
    const doneScheduleList = doneSchedule.map((done) => done.user_tag_id);
    // 해당 날짜의 스케줄 중에 완료된 것들 목록 (배열로) (O)

    const dailyTagLists = dailyTagList.map((schedule) => {
      const categoryArr = schedule["UserTag.Tag.category"].split("#");
      const category = translation(categoryArr, 1);
      return {
        scheduleId: schedule.schedule_id,
        userTagId: schedule.user_tag_id,
        weekCycle: schedule.time_cycle,
        tagName: schedule["UserTag.Tag.tag_name"],
        category,
        done: doneScheduleList.includes(schedule.user_tag_id),
      }; // 데일리 페이지에 전달한 키와 값 정리
    });

    return {
      status: 200,
      result: dailyTagLists,
      message: "날짜에 맞는 태그 일정",
    };
  };

  tagList = async (userId) => {
    const notNew = await DailyRepository.checkSchedule(userId);
    // 배열로 스케줄들의 user_tag_id가 배열로써 나오게 (O)

    const notNewList = notNew.map((check) => {
      return check.user_tag_id;
    }); // 유저의 UserTag 모두 가져오기

    const result = await DailyRepository.tagList(userId);
    // 구매한 태그들 가져옴
    const tagLists = result.map((list) => {
      const categoryArr = list["Tag.category"].split("#");
      const category = translation(categoryArr, 1);
      if (list.start_date == null) {
        return {
          userTagId: list.user_tag_id,
          tagName: list["Tag.tag_name"],
          period: list.period,
          new: !notNewList.includes(list.user_tag_id),
          category,
          date: list.start_date,
        }; // start_date 이 생긴적이 있나 없나
      } else {
        return {
          userTagId: list.user_tag_id,
          tagName: list["Tag.tag_name"],
          period: list.period,
          new: !notNewList.includes(list.user_tag_id),
          category,
          date:
            list.start_date.split(" ")[0] + " ~ " + list.end_date.split(" ")[0],
        }; // 많은 정보를 보내주는 이유는 스케줄 패이지에 쓸 데이터까지 한번에 보내주는 것이다.
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

    if (userTag.start_date == null) {
      const period = userTag.period;
      let endDate = new Date(startDate);
      startDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + period);
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

  scheduleDelete = async (userId, scheduleId) => {
    const result = await DailyRepository.scheduleDelete(userId, scheduleId);

    return {
      status: 200,
      result: {},
      message: "스케줄이 삭제되었습니다.",
    };
  };
})();
