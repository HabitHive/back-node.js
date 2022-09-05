import TagRepository from "../repositories/tag.repository.js";

export default new (class TagService {
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
})();
