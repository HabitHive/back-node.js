const DailyRepository = require("../repositories/daily.repository");
const translation = require("../utils/translation.category");

module.exports = new (class DailyService {
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
        message: "날짜 형식이 잘못 되었습니다.",
      };
    } // 날짜형식이 아니면 걸린다.

    let dailyTagList = await DailyRepository.dailyPage(userId, toDate);
    // 스케줄의 시작날짜 마지막 날짜안에 todayDate가 있는지 확인하고 가져온다.(O)-

    dailyTagList = dailyTagList.filter((check) => {
      return check.week_cycle.includes(week);
    }); // 날짜에 맞추어 들고온 스케줄의 요알에 맞는지 필터 (O)

    const doneSchedule = await DailyRepository.doneSchedule(toDate);
    const doneScheduleList = doneSchedule.map((done) => done.user_tag_id);
    // 해당 날짜의 스케줄 중에 완료된 것들 목록 (배열로) (O)

    const dailyTagLists = dailyTagList.map((schedule) => {
      const categoryArr = schedule["UserTag.Tag.category"].split("#");
      const category = translation(categoryArr, 1);
      const date =
        schedule["UserTag.start_date"].split(" ")[0] +
        "~" +
        schedule["UserTag.end_date"].split(" ")[0];
      return {
        scheduleId: schedule.schedule_id,
        userTagId: schedule.user_tag_id,
        timeCycle: schedule.time_cycle,
        weekCycle: schedule.week_cycle,
        period: schedule["UserTag.period"],
        date,
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
    const date = new Date();
    const notNew = await DailyRepository.checkSchedule(userId);
    // 배열로 스케줄들의 user_tag_id가 배열로써 나오게 (O)

    const notNewList = notNew.map((check) => {
      return check.user_tag_id;
    }); // 유저의 UserTag 모두 가져오기

    const result = await DailyRepository.tagList(userId, date);
    // 구매한 태그들 가져옴 //
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
    // 지금 현재 필요없는 로직
    const result = await DailyRepository.schedulePage(userId, userTagId);
    let date = `${result.start_date}~${result.end_date}`;

    return {
      status: 200,
      result: date,
      message: "스케줄의 기간",
    };
  };
  // 지금은 스케줄의 생성에 대한 로직만

  scheduleCreate = async (
    userId,
    userTagId,
    startTime,
    endTime,
    weekCycle,
    startDate
  ) => {
    // weekCycle는 1개이상 있어야 한다.
    // startTime, endTime는 둘다 정해져서 와야 한다, (태스트 코드 조건 필요)
    // startDate는 2022-09-20의 형태로 와야한다. (문자, 숫자, 안되고 정제되지 않아도 안됨)

    const userTag = await DailyRepository.userTagInOf(userId, userTagId);
    // userTag 에서 구매한 습관의 시작날짜, 지속날짜를 가져온다.
    const period = userTag.period;

    const startDateStr = new Date(startDate);
    startDate = startDate + " 00:00:00"; // startDate는 2022-09-20 00:00:00 형태
    startDateStr.setDate(startDateStr.getDate() + period);
    let endDate = startDateStr.toISOString().split("T")[0] + " 00:00:00"; // 2022-09-25 00:00:00 형태 반환
    const timeCycle = startTime + "~" + endTime; // startTime + "," + endTime;

    if (userTag.start_date == null) {
      await DailyRepository.startDateUpdate(userTagId, startDate, endDate); // 처음
    } else if (new Date() < new Date(userTag.start_date)) {
      await DailyRepository.startDateUpdate(userTagId, startDate, endDate); // 시간이 되기전
    } else {
      // 스타트 시간이 지난 후에 새로운 스케줄을 설정은?? 지금은 수정 X
      // 만들어지는는 스케줄이 달라야한다.? // 시작시간인 지난 뒤에
      await DailyRepository.schedule(userTagId, userId, timeCycle, weekCycle);
      return {
        status: 203,
        message: "스케줄 생성됨 이미 스케줄 싱생된 이후임으로 날짜 수정 안됨",
      };
    }
    await DailyRepository.schedule(userTagId, userId, timeCycle, weekCycle);

    return {
      status: 200,
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
    // weekCycle는 1개이상 있어야 한다.
    // startTime, endTime는 둘다 정해져서 와야 한다, (태스트 코드 조건 필요)
    // startDate는 2022-09-20의 형태로 와야한다. (문자, 숫자, 안되고 정제되지 않아도 안됨)

    const schedule = await DailyRepository.scheduleInOf(userId, scheduleId);
    // 유저의가 선택한 태그의 정보

    const userTagId = schedule.UserTag.user_tag_id;
    const period = schedule.UserTag.period;
    const startDateStr = new Date(startDate);
    startDate = startDate + " 00:00:00"; // startDate는 2022-09-20 00:00:00 형태
    startDateStr.setDate(startDateStr.getDate() + period);
    let endDate = startDateStr.toISOString().split("T")[0] + " 00:00:00"; // 2022-09-25 00:00:00 형태 반환
    const timeCycle = startTime + "~" + endTime;

    if (schedule.UserTag.startDate == null) {
      return {
        status: 400,
        message: "스케줄이 생성된적이 없는 태그를 수정하려고함",
      };
    } else if (new Date() < new Date(schedule.UserTag.startDate)) {
      await DailyRepository.startDateUpdate(userTagId, startDate, endDate); // 시간이 되기전
      await DailyRepository.scheduleUpdate(scheduleId, timeCycle, weekCycle);
    } else {
      // 스타트 시간이 지난 후에 새로운 스케줄을 설정은?? 지금은 수정 X
      // 만들어지는는 스케줄이 달라야한다.? // 시작시간인 지난 뒤에
      await DailyRepository.scheduleUpdate(scheduleId, timeCycle, weekCycle);
      return {
        status: 203,
        message: "스케줄 생성됨 이미 스케줄 싱생된 이후임으로 날짜 수정 안됨",
      };
    }

    return {
      status: 200,
      result: {},
      message: "내 태그 스케줄 수정",
    };
  };

  scheduleDelete = async (userId, scheduleId) => {
    await DailyRepository.scheduleDelete(userId, scheduleId);

    return {
      status: 200,
      result: {},
      message: "스케줄이 삭제되었습니다.",
    };
  };
})();
