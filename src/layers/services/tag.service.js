const TagRepository = require("../repositories/tag.repository");
const UserRepository = require("../repositories/user.repository");
const translation = require("../utils/translation.category");

module.exports = new (class TagService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  tagBuyPage = async (userId, attention) => {
    // TagId의 고유 값을 선택한 횟수 관심회 한 태그들의 목록 으로 추천 알고리즘 만들기 (XXX)

    const curr = new Date(); // 요청 할 때 한국 시간 구하기
    const utc = curr.getTime(); //+ curr.getTimezoneOffset() * 60 * 1000; // 2. UTC 시간 계산
    const lastDate = new Date(utc + 9 * 60 * 60 * 1000);

    const userInfo = await TagRepository.userInterest(userId); // 유저 ID로 유저의 정보를 가져온다.(관심 목록, 포인트)

    if (userInfo.interest == null || !userInfo.interest.includes("#")) {
      return {
        status: 401,
        result: userInfo.interest, // 관심목록이 설정이 잘못됨
        message: "관심 목록 설정이 잘못 되었습니다.",
      };
    }

    let userInterest = userInfo.interest.split("#").slice(1);
    userInterest.pop(); // 관심사를 #으로 자르고 배열로 만든다.
    const categoryCount = userInterest.length; // 관심사의 개수

    if (3 < categoryCount) {
      return {
        status: 403,
        result: userInfo.interest,
        message: "관심 목록 개수가 정해진 양보다 많습니다.",
      };
    } // 관심 개수가 3개 보다 많을때

    const userPoint = userInfo.point; // 포인트 찾아서 보내기 {객체 이름 정한것}
    const buyLists = await TagRepository.userBuyList(userId, lastDate); // 구매한 태그는 찾지 않게 만들기 (O)
    // 구매한 태그들의 가져온다. (스케줄이 끝나면 구매 페이지에 보여준다.)
    const tagIdBuyList = buyLists.map((tag) => tag.tag_id); // 구매한 태그 리스트 목록 배열로(tagId만)

    const tagAllLists = await TagRepository.tagAllList(attention);
    // 태그 전체 목록 리스트

    const tagAllFilterList = tagAllLists.filter(
      (tag) => !tagIdBuyList.includes(tag.tag_id)
    ); // 전체 태그 리스트 중에서 구매한 태그들 필터

    const tagAllList = tagAllFilterList.map((tag) => {
      const categoryArr = tag.category.split("#");
      const category = translation(categoryArr, 1);
      return {
        tagId: tag.tag_id,
        tagName: tag.tag_name,
        category,
      };
    }); // 태그의 키와 값의 형태 정리

    let randomTagList = [];
    let randomCount = []; // 랜덤 요소를 위한 선언

    if (categoryCount != 0) {
      //관심목록을 설정을 했을 경우

      const recommendedList = await TagRepository.recommended(
        categoryCount,
        userInterest
      ); // 관심 목록의 태그들을 배열로 가져옴

      const number = Math.floor(Math.random() * categoryCount);
      // 어떤 카태고리의 태그를 고를지 랜덤 (0,1,2)

      const tagFilterLists = recommendedList[number].filter((tagCategory) => {
        return !tagIdBuyList.includes(tagCategory.tag_id);
      }); // 선택된 카태고리 중에 구매한 태그들을 필터

      const tagCategoryList = tagFilterLists.map((tag) => {
        const categoryArr = tag.category.split("#");
        const category = translation(categoryArr, 1);
        return {
          tagId: tag.tag_id,
          tagName: tag.tag_name,
          category,
        }; // 태그의 키와 값의 형태 정리
      });
      let count = 0; // 관심 목록의 수가 부족할 때 반복 횟수를 제한하는 용도

      while (randomTagList.length != 3 && count != tagCategoryList.length) {
        let randomNum = Math.floor(Math.random() * tagCategoryList.length);
        if (!randomCount.includes(randomNum)) {
          randomTagList.push(tagCategoryList[randomNum]);
          randomCount.push(randomNum);
          count++;
        } // 태그들 중에서 중복 되지 않게 3개의 태그를 배열로 만든다.
      }
    }
    let count = 0; // 관심 목록의 수가 부족할 때 반복 횟수를 제한하는 용도
    while (randomTagList.length != 3 && count != tagAllList.length) {
      //전체 태그들 중에서 중복 되지 않게 3개의 태그를 배열로 만든다.
      let randomNum = Math.floor(Math.random() * tagAllList.length);
      if (!randomCount.includes(randomNum)) {
        randomTagList.push(tagAllList[randomNum]);
        randomCount.push(randomNum);
        count++;
      }
    }

    return {
      status: 200,
      result: { randomTagList, tagAllList, userPoint },
      message: "습관 목록 불러오기 성공",
    }; // 관심목록에 연관된 테그 3개, 구매하지 않은 전체 테그들, 유저가 가지고있는 포인트
  };

  tagBuy = async (userId, tagId, period) => {
    if (isNaN(tagId) || isNaN(period)) {
      return {
        status: 401,
        result: { tagId, period },
        message: " tagId 또는 period 값이 잘못 되었습니다.",
      };
    } // tagId 또는 period 값이 없거나 숫자형이 아니면

    const userInfo = await TagRepository.userInterest(userId);
    const fixPoint = period * 10; // 포인트는 날짜의 *10
    const point = userInfo.point - fixPoint;
    if (point < 0) {
      return {
        status: 400,
        result: point,
        message: "보유한 포인트가 부족합니다.",
      };
    } // 포인트를 개산해서 포인트가 부족하면 부족한 포인트 리턴

    const curr = new Date(); // 요청 할 때 한국 시간 구하기
    const utc = curr.getTime(); //+ curr.getTimezoneOffset() * 60 * 1000; // 2. UTC 시간 계산
    const lastDate = new Date(utc + 9 * 60 * 60 * 1000);

    const result = await TagRepository.tagBuy(
      userId,
      tagId,
      period,
      point, // 포인트 개산한것 업데이트 하면서 태그를 구매
      lastDate // 구매할때 내가 구매한 태그들이 없으면 구매
    );
    if (result == "잘못된 요청") {
      return {
        status: 403,
        result: userInfo.point,
        message: "이미 구매한 태그에 대한 요청입니다.",
      };
    }
    return { status: 200, result: point, message: "내 습관 구매 완료" };
  };

  mytagCreate = async (userId, tagName, category) => {
    await TagRepository.mytagCreate(userId, tagName, category);
    return { status: 200, message: "내 습관 테그 추가" };
  };

  mytagDelete = async (userId, tagId) => {
    await TagRepository.mytagDelete(userId, tagId);
    return { status: 200, message: "내 습관 테그 삭제" };
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
    else if (schedule.user_id !== userId)
      return this.result(403, "본인의 일정이 아닙니다.");

    const userTagId = schedule.user_tag_id;
    const tag = await TagRepository.findUserTag(userTagId);
    const date = new Date(strDate);
    const startDate = new Date(tag.start_date);
    let endDate = new Date(tag.end_date);

    if (date < startDate) return this.result(400, "시작되지 않은 일정입니다.");
    else if (date > endDate) return this.result(400, "종료된 일정입니다.");

    const done = await TagRepository.createDone(
      userId,
      scheduleId,
      userTagId,
      date
    );

    const exist = await UserRepository.existHistory(userTagId, date);
    const first = exist ? false : true; // 이미 기록이 존재한다면 포인트 X

    let bonus = false;
    let bonusPoint = 0;

    if (first) {
      const userPoint = await UserRepository.findPoint(userId);
      const increase = await UserRepository.updatePoint(userId, userPoint + 20);
      if (increase == [0]) return this.result(400, "알 수 없는 에러");
      await UserRepository.createHistory(userId, 20, date, userTagId);

      const bonusDay = date.getTime() >= endDate.getTime();

      if (bonusDay) {
        const count = await UserRepository.countHistory(userTagId);
        bonus = count == tag.period; // 일정 내내 성공했다면 보너스 true

        if (bonus) {
          bonusPoint = tag.period * 20;
          const increase = await UserRepository.updatePoint(
            userId,
            userPoint + 20 + bonusPoint
          );
          if (increase == [0]) return this.result(400, "알 수 없는 에러");
        }
        const updateTag = await TagRepository.isSuccess(userTagId, bonus);
        if (updateTag == [0]) return this.result(400, "알 수 없는 에러");
      }
    }

    return this.result(201, "습관 완료", { first, bonus, bonusPoint });
  };
})();
