import TagRepository from "../repositories/tag.repository.js";
import UserRepository from "../repositories/user.repository.js";

export default new (class TagService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  buyPage = async (userId) => {
    // 나중에 구매한 태그는 찾지 않게 만들기
    const userInfo = await TagRepository.interest(userId);
    // 관심사 선택을 아무 것도 안했을 경우 #만 넘어온다. if 문으로 잡아라
    const uaerInterest = userInfo.interest.split("#");
    // console.log(uaerInterest);
    const categoryList = uaerInterest.length;

    const recommendedList = await TagRepository.recommended(
      categoryList,
      categoryList
    ); // TagId의 고유 값을 선택한 회수 관심회 한 태그들의 목록

    const number = Math.floor(Math.random() * categoryList - 2) + 1;

    const algorithmScore = [];
    if (number == 1) {
      algorithmScore = recommendedList.tagList1.map((point) => {
        return {
          tagId: point.tag_id,
          score: 1,
        };
      });
    }
    if (number == 2) {
      algorithmScore = recommendedList.tagList2.map((point) => {
        return {
          tagId: point.tag_id,
          score: 1,
        };
      });
    }
    if (number == 3) {
      algorithmScore = recommendedList.tagList3.map((point) => {
        return {
          tagId: point.tag_id,
          score: 1,
        };
      });
    }
    let randomTagList = [];
    for (i = 0; i < 3; i++) {
      randomNum = Math.floor(Math.random() * algorithmScore.length);
      randomTagList.push(randomNum);
    }

    const result = await TagRepository.buyPage();
    return {
      status: 200,
      result: randomTagList,
      result,
      message: "습관 목록 불러오기 성공",
    };
  };

  tagBuy = async (userId, tagId, period) => {
    const result = await TagRepository.tagBuy(userId, tagId, period);

    return {
      status: 200,
      result: result,
      message: "내 습관 추가",
    };
  };

  done = async (userId, scheduleId, strDate) => {
    const schedule = await TagRepository.findSchedule(scheduleId);
    if (!schedule) return this.result(400, "존재하지 않는 일정입니다.");
    else if (schedule.User["user_id"] !== userId)
      return this.result(401, "본인의 일정이 아닙니다.");

    const userTagId = schedule.user_tag_id;
    const tag = await TagRepository.findUserTag(userTagId);
    const date = new Date(strDate);
    const startDate = new Date(tag.start_date);
    const endDate = new Date(tag.end_date);

    if (date < startDate) return this.result(400, "시작되지 않은 일정입니다.");
    else if (date > endDate) return this.result(400, "종료된 일정입니다.");

    const done = await TagRepository.createDone(
      userId,
      userTagId,
      date,
      schedule.time_cycle
    );
    console.log(done);

    const exist = await UserRepository.existHistory(userTagId, date);
    const fisrt = exist ? false : true;
    let bonus = false;
    let bonusPoint = 0;

    if (fisrt && date != endDate) {
      const userPoint = await UserRepository.findPoint(userId);
      const increase = await UserRepository.updatePoint(userId, userPoint + 20);
      if (increase == [0]) return this.result(400, "알 수 없는 에러");

      await UserRepository.createHistory(userId, 20, date, userTagId);
    }

    if (fisrt && date == endDate) {
      // 보너스 날
      const count = await UserRepository.countHistory(userTagId);
      bonus = count == tag.period;
      if (bonus) {
        bonusPoint = tag.period * 20;
      }

      const userPoint = await UserRepository.findPoint(userId);
      const increase = await UserRepository.updatePoint(
        userId,
        userPoint + 20 + bonusPoint
      );
      if (increase == [0]) return this.result(400, "알 수 없는 에러");

      const updateTag = await TagRepository.isSuccess(userTagId, bonus);
      if (updateTag == [0]) return this.result(400, "알 수 없는 에러");
    }

    return this.result(201, "습관 완료", { first, bonus, bonusPoint });
  };
})();
