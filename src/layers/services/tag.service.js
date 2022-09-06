import TagRepository from "../repositories/tag.repository.js";
import UserRepository from "../repositories/user.repository.js";

export default new (class TagService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  buyPage = async (userId) => {
    // 구매한 태그는 찾지 않게 만들기 (X)
    // TagId의 고유 값을 선택한 횟수 관심회 한 태그들의 목록 으로 추천 알고리즘 만들기 (XXX)

    const userInfo = await TagRepository.interest(userId);
    // 관심사 선택을 아무 것도 안했을 경우 #만 넘어온다. if 문으로 잡아라
    const userInterest = userInfo.interest.split("#");
    // console.log(userInterest);
    const categoryList = userInterest.length;

    const tagLists = await TagRepository.buyPage();

    const tagList = tagLists.map((allList) => {
      return {
        tagId: allList.tag_id,
        tagName: allList.tag_name,
      };
    });

    //관심목록을 설정을 안했을 경우 (O)
    if (categoryList != 2) {
      const recommendedList = await TagRepository.recommended(
        categoryList,
        userInterest
      );
      const number = Math.floor(Math.random() * (categoryList - 2)) + 1;
      let algorithmScore = [];
      if (number == 1) {
        algorithmScore = recommendedList.tagList1.map((point) => {
          return {
            tagId: point.tag_id,
            tagName: point.tag_name,
          };
        });
      }
      if (number == 2) {
        algorithmScore = recommendedList.tagList2.map((point) => {
          return {
            tagId: point.tag_id,
            tagName: point.tag_name,
          };
        });
      }
      if (number == 3) {
        algorithmScore = recommendedList.tagList3.map((point) => {
          return {
            tagId: point.tag_id,
            tagName: point.tag_name,
          };
        });
      }

      let randomTagList = [];
      let randomCount = [];
      while (randomTagList.length != 3) {
        let randomNum = Math.floor(Math.random() * (algorithmScore.length + 1));
        if (!randomCount.includes(randomNum)) {
          randomTagList.push(algorithmScore[randomNum]);
          randomCount.push(randomNum);
        }
      }
    } else {
      let randomTagList = [];
      let randomCount = [];
      while (randomTagList.length != 3) {
        let randomNum = Math.floor(Math.random() * (tagLists.length + 1));
        if (!randomCount.includes(randomNum)) {
          randomTagList.push(tagLists[randomNum]);
          randomCount.push(randomNum);
        }
      }
    } // 관심사 없을 때

    return {
      status: 200,
      result: { randomTagList, tagList },
      message: "습관 목록 불러오기 성공",
    };
  };

  tagBuy = async (userId, tagId, period) => {
    const result = await TagRepository.tagBuy(userId, tagId, period);

    return { status: 200, result, message: "내 습관 추가" };
  };

  /**
   * 습관을 완료했을 때 호출
   * @param {number} userId 사용자별 유니크 숫자
   * @param {number} scheduleId 일정 유니크 숫자
   * @param {string} strDate 문자열 날짜
   * @returns first : 첫 완료 여부 / bonus : 보너스 여부 / bonusPoint
   */
  done = async (userId, scheduleId, strDate) => {
    /* 일정 정보 불러오기 */
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
    const fisrt = exist ? false : true; // 이미 기록이 존재한다면 포인트 X
    let bonus = false;
    let bonusPoint = 0;

    /* 첫 완료*/
    if (fisrt && date != endDate) {
      const userPoint = await UserRepository.findPoint(userId);
      const increase = await UserRepository.updatePoint(userId, userPoint + 20);
      if (increase == [0]) return this.result(400, "알 수 없는 에러");

      await UserRepository.createHistory(userId, 20, date, userTagId);
    }

    /* 첫 완료 + 마지막 날 */
    if (fisrt && date == endDate) {
      const count = await UserRepository.countHistory(userTagId);
      bonus = count == tag.period; // 일정 내내 성공했다면 보너스 true
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
