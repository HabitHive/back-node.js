import TagService from "../services/tag.service.js";

export default new (class TagController {
  buyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 1;
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
      // const userId = 2;
      const { tagId } = req.params;
      // 파라미터로 꺼내면 문자형이에요
      const { period } = req.body;

      const date = await TagService.tagBuy(userId, tagId / 1, period);
      return res
        .status(date.status)
        .json({ result: date.result, message: date.message });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  doneTag = async (req, res) => {
    const { userId } = res.locals;
    const { scheduleId, date } = req.body;

    const receive = await TagService.done(userId, scheduleId, date);
    return res.status(receive.status).json(receive.message, receive.result);
  };
})();
