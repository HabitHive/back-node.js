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
    }); // 날짜에 맞추어 들고온 스케줄의 요일에 맞는지 필터 (O)

    dailyTagList = dailyTagList.filter((check) => {
      if (check.after_date != null) {
        if (check.after_date.split("T")[1] == "+")
          return toDate >= new Date(check.after_date.split("T")[0]);
        if (check.after_date.split("T")[1] == "-")
          return toDate <= new Date(check.after_date.split("T")[0]);
      }
      return toDate >= new Date(check.after_date);
    }); // 이후에 된 날짜가 있는지 확인하고 요일 안에 있는지 필터

    const doneSchedule = await DailyRepository.doneSchedule(userId, toDate);
    const doneScheduleList = doneSchedule.map((done) => done.schedule_id); // 해당 날짜의 스케줄 중에 완료된 것들 목록 (배열로) (O)

    const dailyTagLists = dailyTagList.map((schedule) => {
      const categoryArr = schedule["UserTag.Tag.category"].split("#");
      const category = translation(categoryArr, 1);
      let startDate = schedule["UserTag.start_date"].split(" ")[0];
      let endDate = schedule["UserTag.end_date"].split(" ")[0];
      let dDay = schedule["UserTag.period"];

      if (schedule.after_date != null) {
        if (schedule.after_date.split("T")[1] == "+") {
          startDate = schedule.after_date.split("T")[0];
        } else {
          endDate = schedule.after_date.split("T")[0];
        }
      }
      if (new Date(toDate) > new Date(schedule["UserTag.start_date"])) {
        dDay = Math.floor(
          (new Date(schedule["UserTag.end_date"]).getTime() -
            new Date(toDate).getTime()) /
            (1000 * 60 * 60 * 24) +
            1
        ); // 멥 메소드가 아니라 9시간 데해 주면 된다. => ["UserTag.end_date"]에 09:00:00으로
      } // MySQL에 저장 할때 9시간을 빼면서 넣어주고 생성할때에는 9시간을 우리나라기준으로 더한다.

      return {
        scheduleId: schedule.schedule_id,
        userTagId: schedule.user_tag_id,
        timeCycle: schedule.time_cycle,
        weekCycle: schedule.week_cycle,
        period: dDay,
        date: startDate + "~" + endDate, // after_date가 있다면 시작날짜를 수정후 리턴
        tagName: schedule["UserTag.Tag.tag_name"],
        color: schedule["UserTag.Tag.color"],
        category,
        done: doneScheduleList.includes(schedule.schedule_id),
      }; // 데일리 페이지에 전달한 키와 값 정리
    });

    return {
      status: 200,
      result: dailyTagLists,
      message: "날짜에 맞는 태그 일정",
    };
  };

  tagList = async (userId) => {
    const notNew = await DailyRepository.checkSchedule(userId); // 배열로 스케줄들의 user_tag_id가 배열로써 나오게 (O)

    const notNewList = notNew.map((check) => {
      return check.user_tag_id;
    }); // 유저의 UserTag 모두 가져오기

    const curr = new Date(); // 요청 할 때 한국 시간 구하기
    const utc = curr.getTime(); // + curr.getTimezoneOffset() * 60 * 1000; // 2. UTC 시간 계산
    const lastDate = new Date(utc + (9 - 24) * 60 * 60 * 1000);

    const result = await DailyRepository.tagList(userId, lastDate); // 구매한 태그들 가져옴 //

    const tagLists = result.map((list) => {
      const categoryArr = list["Tag.category"].split("#");
      const category = translation(categoryArr, 1);
      let date = list.start_date;
      if (list.start_date != null) {
        date =
          list.start_date.split(" ")[0] + " ~ " + list.end_date.split(" ")[0];
      } // start_date 이 생긴적이 있나 없나
      return {
        userTagId: list.user_tag_id,
        tagName: list["Tag.tag_name"],
        period: list.period,
        new: !notNewList.includes(list.user_tag_id),
        category,
        color: list["Tag.color"],
        date,
      };
    });
    return {
      status: 200,
      result: tagLists,
      message: "유저의 태그 목록",
    };
  };

  scheduleCreate = async (
    userId,
    userTagId,
    startTime,
    endTime,
    weekCycle,
    startDate
  ) => {
    const curr = new Date(); // 요청 할 때 한국 시간 구하기
    const utc = curr.getTime(); // + curr.getTimezoneOffset() * 60 * 1000; // 2. UTC 시간 계산
    const krNewDate = new Date(utc + 9 * 60 * 60 * 1000);
    if (weekCycle == "") {
      return {
        status: 400,
        message: "요일을 선택하지 않았습니다.",
      }; // 각가의 값을 선택하지 않은 경우에 대한 메세지
    }
    if (!startTime || !endTime) {
      return {
        status: 400,
        message: "시간을 선택하지 않았습니다.",
      }; // 각가의 값을 선택하지 않은 경우에 대한 메세지
    }
    if (!startDate) {
      return {
        status: 400,
        message: "날짜을 선택하지 않았습니다.",
      }; // 각가의 값을 선택하지 않은 경우에 대한 메세지
    }
    let [start, end] = [startTime.split(""), endTime.split("")];
    while (start.length != 5 || end.length != 5) {
      if (start[1] == ":") {
        start.unshift("0");
      } else if (start.length != 5) {
        start.push("0");
      }
      if (end[1] == ":") {
        end.unshift("0");
      } else if (end.length != 5) {
        end.push("0");
      }
    } // 시간이  0을 생략하는 것에대한 0 넣어주기
    [startTime, endTime] = [start.join(""), end.join("")];
    const timeCycle = startTime + "~" + endTime; // startTime + "," + endTime; 00:00 형태

    const userTag = await DailyRepository.userTagInOf(userId, userTagId); // userTag 에서 구매한 습관의 시작날짜, 지속날짜를 가져온다.
    if (userTag == null) {
      return {
        status: 401,
        message: "가지고 있지않은 구매 습관을 불러오려하고 있다.",
      };
    }
    const startDateStr = new Date(startDate); // startDate는 2022-09-20 00:00:00 형태
    startDateStr.setDate(startDateStr.getDate() + userTag.period - 1);
    let endDate = startDateStr.toISOString().split("T")[0]; // 2022-09-25 00:00:00 형태 반환

    if (userTag.start_date == null) {
      await DailyRepository.startDateUpdate(userTagId, startDate, endDate); // 처음
    } else if (krNewDate < new Date(userTag.start_date)) {
      await DailyRepository.startDateUpdate(userTagId, startDate, endDate); // 시간이 되기전
    } else {
      const afterDate = startDate + "T+"; // 스케줄이 시작된 이후의 생성의 경우 데일리에서 구분하기 위한 로직
      await DailyRepository.schedule(
        userTagId,
        userId,
        timeCycle,
        weekCycle,
        afterDate
      );
      return {
        status: 201,
        message: "스케줄 실행된 후의 스케줄 생성 완료",
      };
    }
    await DailyRepository.schedule(userTagId, userId, timeCycle, weekCycle);

    return {
      status: 200,
      message: "내 태그 스케줄 추가",
    };
  };

  scheduleUpdate = async (
    userId, // 스케줄을 선택하고 수정할 때 원래 있던 스케줄 수정
    scheduleId,
    startTime,
    endTime,
    weekCycle,
    startDate
  ) => {
    const curr = new Date(); // 요청 할 때 한국 시간 구하기
    const utc = curr.getTime(); //+ curr.getTimezoneOffset() * 60 * 1000; // 2. UTC 시간 계산
    const krNewDate = new Date(utc + 9 * 60 * 60 * 1000);
    if (weekCycle == "") {
      return {
        status: 400,
        message: "요일을 선택하지 않았습니다.",
      }; // 각가의 값을 선택하지 않은 경우에 대한 메세지
    }
    if (!startTime || !endTime) {
      return {
        status: 400,
        message: "시간을 선택하지 않았습니다.",
      }; // 각가의 값을 선택하지 않은 경우에 대한 메세지
    }
    if (!startDate) {
      return {
        status: 400,
        message: "날짜을 선택하지 않았습니다.",
      }; // 각가의 값을 선택하지 않은 경우에 대한 메세지
    }
    let [start, end] = [startTime.split(""), endTime.split("")];
    while (start.length != 5 || end.length != 5) {
      if (start[1] == ":") {
        start.unshift("0");
      } else if (start.length != 5) {
        start.push("0");
      }
      if (end[1] == ":") {
        end.unshift("0");
      } else if (end.length != 5) {
        end.push("0");
      }
    } // 시간이  0을 생략하는 것에대한 0 넣어주기
    [startTime, endTime] = [start.join(""), end.join("")];
    const timeCycle = startTime + "~" + endTime;

    const schedule = await DailyRepository.scheduleInOf(userId, scheduleId); // 유저가 생성한 스케줄의 정보
    if (schedule == null) {
      return {
        status: 401,
        message: "존재하지 않은 스케줄을 수정하려 한다.",
      };
    }
    const userTagId = schedule.user_tag_id;

    const startDateStr = new Date(startDate); // startDate는 2022-09-20 00:00:00 형태
    startDateStr.setDate(
      startDateStr.getDate() + schedule["UserTag.period"] - 1
    );
    let endDate = startDateStr.toISOString().split("T")[0]; // 2022-09-25 00:00:00 형태 반환

    if (schedule["UserTag.start_date"] == null) {
      return {
        status: 400,
        message: "스케줄이 생성된적이 없는 태그를 수정하려고함",
      };
    } else if (krNewDate <= new Date(schedule["UserTag.start_date"])) {
      await DailyRepository.startDateUpdate(userTagId, startDate, endDate); // 시간이 되기전
      await DailyRepository.scheduleUpdate(scheduleId, timeCycle, weekCycle);
    } else {
      let afterDate = startDate + "T+";
      await DailyRepository.schedule(
        userTagId,
        userId,
        timeCycle,
        weekCycle,
        afterDate
      );
      const startDateStr = new Date(startDate);
      startDateStr.setDate(startDateStr.getDate() - 1);
      afterDate = startDateStr.toISOString().split("T")[0] + "T-";
      await DailyRepository.scheduleUpdate(
        scheduleId,
        timeCycle,
        weekCycle,
        afterDate
      );

      return {
        status: 203,
        message: "스케줄 생성됨 시작날짜 수정 안됨 스케줄 시작했음",
      };
    }

    return {
      status: 200,
      message: "내 태그 스케줄 수정",
    };
  };

  scheduleDelete = async (userId, scheduleId) => {
    await DailyRepository.scheduleDelete(userId, scheduleId);

    return {
      status: 200,
      message: "스케줄이 삭제되었습니다.",
    };
  };
})();
