import Tagrepositories from "../repositories/tag.repository.js";

class tagservices {
  tagrepositories = new Tagrepositories();

  buypage = async (userId) => {
    const interest = await this.tagrepositories.buypage(userId);
    const result = await this.tagrepositories.buypage();

    return result;
  };

  tagbuy = async (userId, tagId, period, startDate) => {
    let endDate = startDate;
    endDate.setDate(endDate.getDate() + period);

    const result = await this.tagrepositories.tagbuy(
      userId,
      tagId,
      period,
      startDate,
      endDate
    );

    return result;
  };
}

export default tagservices;
