import TagRepository from "../repositories/tag.repository.js";

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

  myTag = async (userId, today) => {
    const tagLists = await TagRepository.myAllTagList(userId);
    let stillTags = [];
    let doneList = [];
    let doneTags = { success: [], fail: [] };

    if (tagLists == [])
      return this.result(200, "습관 기록이 없습니다.", { stillTags, doneTags });

    // 수정 중
    for (let tag in tagLists) {
      if (tag.end_date.getDate() > today) {
        stillTags.push(tag);
      } else {
        doneList.push(tag);
      }
    }

    for (let tag in stillTags) {
      let week = [false, false, false, false, false, false, false];
      const scheduleList = await TagRepository.schedule(tag.user_tag_id);
      for (let schedule in scheduleList) {
        const strWeek = schedule.week_cycle;
        const numWeek = strWeek.split("뭐로 자르지?");
        for (let w in numWeek) {
          week[w] = true;
        }
      }
      stillTags[tag].week_cycle = week;

      const start = tag.start_date.getDate();
      const period = tag.period;
      if (start <= today) {
        stillTags[tag].d_day = start - today + period;
      }
    }

    for (let tag in doneList) {
      // count method 사용해서 수정하기
      const history = await TagRepository.pointHistory(tag.user_tag_id);
      const count = history.length;
      if (count == tag.period) {
        doneTags.success.push(tag);
      } else {
        doneTags.fail.push(tag);
      }
    }

    return this.result(200, "흐에엥", { stillTags, doneTags });
  };
})();
