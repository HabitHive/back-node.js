import TagRepository from "../repositories/tag.repository.js";
import UserRepository from "../repositories/user.repository.js";

export default new (class TagService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  tagBuyPage = async (userId) => {
    // 구매한 태그는 찾지 않게 만들기 (O)
    // TagId의 고유 값을 선택한 횟수 관심회 한 태그들의 목록 으로 추천 알고리즘 만들기 (XXX)

    const userInfo = await TagRepository.userInterest(userId);
    // 관심사 선택을 아무 것도 안했을 경우 #만 넘어온다. if 문으로 잡아라

    if (userInfo.interest == null) {
      // 관심목록이 비었을때
      return {
        status: 400,
        result: userInfo.interest,
        message: "관심 목록 설정이 잘못 되었는데",
      };
    }

    const userInterest = userInfo.interest.split("#").slice(1);
    userInterest.pop(); // 관심사를 #으로 자르고 배열로 만든다.

    const categoryCount = userInterest.length; // 관심사의 개수

    if (3 < categoryCount) {
      // 관심 개수가 3개 보다 많을때
      return {
        status: 400,
        result: userInfo.interest,
        message: "관심 목록 개수가 많은데?",
      };
    }

    const userPoint = userInfo.point;
    // 포인트 찾아서 보내기 {객체 이름 정한것}

    const buyLists = await TagRepository.userBuyList(userId);
    // 구매한 태그들

    const tagIdBuyList = buyLists.map((tag) => tag.tag_id);
    // 구매한 태그 리스트 목록 배열로(tagId만)

    const tagAllLists = await TagRepository.tagAllList();
    // 태그 전체 목록 리스트

    const tagAllFilterList = tagAllLists.filter(
      (tag) => !tagIdBuyList.includes(tag.tag_id)
    ); // 전체 태그 리스트 중에서 구매한 태그들 필터

    const tagAllList = tagAllFilterList.map((allList) => {
      // 태그의 키와 값의 형태 정리
      return {
        tagId: allList.tag_id,
        tagName: allList.tag_name,
        category: allList.category.split("#"),
      };
    });

    let randomTagList = [];
    let randomCount = [];
    // 랜덤 요소를 위한 선언

    if (categoryCount != 0) {
      //관심목록을 설정을 했을 경우

      const recommendedList = await TagRepository.recommended(
        categoryCount,
        userInterest
      ); // 관심 목록의 태그들을 배열로 가져옴

      const number = Math.floor(Math.random() * categoryCount);
      // 어떤 카태고리의 태그를 고를지 랜덤

      const tagFilterLists = recommendedList[number].filter((tagCategory) => {
        return !tagIdBuyList.includes(tagCategory.tag_id);
      }); // 선택된 카태고리 중에 구매한 태그들을 필터

      const tagCategoryList = tagFilterLists.map((allList) => {
        return {
          tagId: allList.tag_id,
          tagName: allList.tag_name,
          category: allList.category.split("#"),
        }; // 태그의 키와 값의 형태 정리
      });
      // 태그가 수가 부족하면 무한 로딩에 걸릴 수있다...
      // 카테고리로 찾는 경우에는 특정 카테고리에 대해서 다 사고 찾을 때 개수가 3개보다 부족할 수 있다.
      let count = 0;
      // 관심 목록의 수가 부족할 때 반복 횟수를 제한하는 용도

      while (randomTagList.length != 3 && count != 30) {
        // 태그들 중에서 중복 되지 않게 3개의 태그를 배열로 만든다.
        let randomNum = Math.floor(Math.random() * tagCategoryList.length);
        if (!randomCount.includes(randomNum)) {
          randomTagList.push(tagCategoryList[randomNum]);
          randomCount.push(randomNum);
        }
        count += 1;
      }
    }
    while (randomTagList.length != 3) {
      //전체 태그들 중에서 중복 되지 않게 3개의 태그를 배열로 만든다.
      let randomNum = Math.floor(Math.random() * tagAllList.length);
      if (!randomCount.includes(randomNum)) {
        randomTagList.push(tagAllList[randomNum]);
        randomCount.push(randomNum);
      }
    }
    return {
      status: 200,
      result: { randomTagList, tagAllList, userPoint },
      message: "습관 목록 불러오기 성공",
    }; // 추천의 랜덤 3개, 구매하지 않은 전체 테그들, 유저가 가지고있는 포인트
  };

  tagBuy = async (userId, tagId, period) => {
    // 같은 태그를 구매하나? 테이블 만들 때 찾으면서 만드느 것 있던 데 (x)

    const userInfo = await TagRepository.userInterest(userId);
    const fixPoint = period * 10; // 포인트는 어떡게 만들어나...
    const point = userInfo.point - fixPoint;
    if (point < 0) {
      return {
        status: 400,
        result: point,
        message: "보유한 포인트가 부족합니다.",
      };
    }

    const result = await TagRepository.tagBuy(userId, tagId, period, point);

    return { status: 200, result: point, message: "내 습관 추가" };
  };

  monthDone = async (userId, strDate) => {
    const splitDate = strDate.split("-");
    const year = splitDate[0] / 1;
    const month = splitDate[1] / 1;

    if (!Number.isInteger(year) || !Number.isInteger(month))
      return this.result(400, "monthly/yyyy-mm(-dd) 형식을 지켜주세요.");
    if (year > 2500 || year < 1900 || month > 12 || month < 0)
      return this.result(400, "검색 범주를 벗어난 날짜입니다.");

    const lastDate = new Date(year, month, 0);
    const thisMonth = new Date(year, month - 1, 1);
    const nextMonth = new Date(year, month, 1);

    const history = await UserRepository.colorHistory(
      userId,
      thisMonth,
      nextMonth
    );

    let color = [null];
    const lastNum = lastDate.getDate();
    for (let i = 1; i <= lastNum; i++) color.push(0);

    if (history.length == 0) return this.result(200, "데이터 없음", color);

    for (let h in history) {
      const doneDate = new Date(h.date);
      color[doneDate.getDate()]++;
    }
    for (let i = 1; i <= lastNum; i++) if (color[i] > 4) color[i] = 4;

    return this.result(200, "일별 색상", color);
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
