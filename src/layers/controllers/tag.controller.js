import TagServices from "../services/tag.services.js";

export default class tagController {
  tagServices = new TagServices();

  buyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;
      const result = await this.tagServices.buyPage(userId);

      return res.status(200).json({ result, message: "목록 불러오기 성공" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  tagBuy = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { tagId } = req.params;
      const { period } = req.body;

      const result = await this.tagServices.tagBuy(userId, tagId, period);

      return res.status(200).json({ result, message: "내 태그에 추가" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };
}
