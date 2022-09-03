import TagRepositories from "../repositories/tag.repository.js";

export default class tagServices {
  tagRepositories = new TagRepositories();

  buyPage = async (userId) => {
    const userInfo = await this.tagRepositories.interest(userId);
    // 관심사 선택을 아무 것도 안했을 경우 #만 넘어온다. if 문으로 잡아라

    const uaerInterest = userInfo.interest.split("#");
    // console.log(uaerInterest); // #abc#sad#rgkstla# 이런 형태로 넘어옴
    // [,a,b,c,] //배열의 1번쨰 2번쨰 3번쨰

    const recommendedList = await this.tagRepositories.recommended(
      uaerInterest
    ); // TagId의 고유 값을 선택한 회수 관심회 한 태그들의 목록
    // console.log(recommendedList.tagList1);
    const algorithmScore1 = recommendedList.tagList1.map((point) => {
      return {
        tagId: point.tag_id,
      };
    });
    const algorithmScore2 = recommendedList.tagList2.map((point) => {
      return {
        tagId: point.tag_id,
      };
    });
    const algorithmScore3 = recommendedList.tagList3.map((point) => {
      return {
        tagId: point.tag_id,
      };
    });
    for (let i = 0; i < algorithmScore1.length; i++) {}
    // console.log(algorithmScore1.tagId);
    // console.log(algorithmScore2[0].tagId);
    // console.log(algorithmScore3[0].tagId);

    const result = await this.tagRepositories.buyPage();

    return { recommendedList, result };
  };

  tagBuy = async (userId, tagId, period) => {
    const result = await this.tagRepositories.tagBuy(userId, tagId, period);

    return result;
  };
}
