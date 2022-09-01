import TagRepositories from "../repositories/tag.repository.js";

export default class tagServices {
  tagRepositories = new TagRepositories();

  buyPage = async (userId) => {
    const userInfo = await this.tagRepositories.interest(userId);
    // 관심사 선택을 아무 것도 안했을 경우 #만 넘어온다. if 문으로 잡아라
    const uaerInterest = userInfo.interest.split("#");
    console.log(uaerInterest);

    const recommendedList = await this.tagRepositories.recommended(
      uaerInterest
    ); // TagId의 고유 값을 선택한 회수 관심회 한 태그들의 목록
    const algorithmScore = recommendedList.map((point) => {
      return {
        tagId: point.id,
        tagName: point.tagName,
        score: 1,
      };
    });

    const result = await this.tagRepositories.buyPage();

    return result;
  };

  tagBuy = async (userId, tagId, period) => {
    const result = await this.tagRepositories.tagBuy(userId, tagId, period);

    return result;
  };
}
