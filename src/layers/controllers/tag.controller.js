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
      const { tagId, period } = req.body;

      const date = await TagService.tagBuy(userId, tagId, period);
      return res
        .status(date.status)
        .json({ result: date.result, message: date.message });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };
  response = (res, receive) => {
    res
      .status(receive.status)
      .json({ message: receive.message, result: receive.result });
  };

  invalid = (res) => {
    res.status(400).json({ message: "필수 입력값이 비어 있습니다." });
  };

  monthly = async (req, res) => {
    const { userId } = res.locals;
    const date = req.params.date;
    if (!date) return this.invalid(res);

    const receive = await TagService.monthDone(userId, date);
    return this.response(res, receive);
  };

  doneTag = async (req, res) => {
    const { userId } = res.locals;
    const { scheduleId, date } = req.body;
    if (!scheduleId || !date) return this.invalid(res);

    const receive = await TagService.done(userId, scheduleId, date);
    return this.response(res, receive);
  };
})();
