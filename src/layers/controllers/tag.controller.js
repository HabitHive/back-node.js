import Tagservices from "../services/tag.services.js";

class tagcontroller {
  tagservices = new Tagservices();

  buypage = async (req, res, next) => {
    try {
      const { userId } = res.locals;

      const result = await this.tagservices.buypage(userId);

      return res.status(200).json({ result, message: "목록 불러오기 성공" });
    } catch {}
  };

  tagbuy = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { tagId } = req.params;
      const { period, startDate } = req.params;

      const result = await this.tagservices.tagbuy(
        userId,
        tagId,
        period,
        startDate
      );

      return res.status(200).json({ result, message: "내 태그에 추가" });
    } catch {}
  };
}
export default tagcontroller;
