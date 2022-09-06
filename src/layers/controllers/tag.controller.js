import TagService from "../services/tag.service.js";

export default new (class TagController {
  buyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;
      const date = await TagService.buyPage(userId);
      return res
        .status(date.status)
        .json({ result: date.result, message: date.message });
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

      const dete = await TagService.tagBuy(userId, tagId, period);

      return res.status(dete.status).json(dete.result, dete.message);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };
})();
