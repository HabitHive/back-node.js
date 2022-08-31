import TagRepositories from "../repositories/tag.repository.js";

export default class tagServices {
  tagRepositories = new TagRepositories();

  buyPage = async (userId) => {
    const interest = await this.tagRepositories.interest(userId);
    const result = await this.tagRepositories.buyPage();

    return result;
  };

  tagBuy = async (userId, tagId, period, startDate) => {
    let endDate = startDate;
    endDate.setDate(endDate.getDate() + period);

    const result = await this.tagRepositories.tagBuy(
      userId,
      tagId,
      period,
      startDate,
      endDate
    );

    return result;
  };
}
