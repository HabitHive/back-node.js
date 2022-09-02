import TagRepository from "../repositories/tag.repository.js";

export default new (class TagService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  buyPage = async (userId) => {
    const userInfo = await TagRepository.interest(userId);
    // 관심사 선택을 아무 것도 안했을 경우 #만 넘어온다. if 문으로 잡아라
    const uaerInterest = userInfo.interest.split("#");
    console.log(uaerInterest);

    const recommendedList = await TagRepository.recommended(uaerInterest); // TagId의 고유 값을 선택한 회수 관심회 한 태그들의 목록
    const algorithmScore = recommendedList.map((point) => {
      return {
        tagId: point.id,
        tagName: point.tagName,
        score: 1,
      };
    });

    const result = await TagRepository.buyPage();

    return result;
  };

  tagBuy = async (userId, tagId, period) => {
    const result = await TagRepository.tagBuy(userId, tagId, period);

    return result;
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
