import TagRepository from "../repositories/tag.repository.js";

export default new (class TagService {
  buyPage = async (userId) => {
    // 구매한 태그는 찾지 않게 만들기 (X)
    // TagId의 고유 값을 선택한 횟수 관심회 한 태그들의 목록 으로 추천 알고리즘 만들기 (XXX)

    const userInfo = await TagRepository.interest(userId);
    // 관심사 선택을 아무 것도 안했을 경우 #만 넘어온다. if 문으로 잡아라 (O)
    const uaerInterest = userInfo.interest.split("#");
    const categoryList = uaerInterest.length;

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
        uaerInterest
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

    return {
      status: 200,
      result: result,
      message: "내 습관 추가",
    };
  };
})();
