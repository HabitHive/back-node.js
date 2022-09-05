import TagService from "../services/tag.service.js";

export default new (class TagController {
  buyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;
      const dete = await this.tagServices.buyPage(userId);

      return res.status(dete.status).json(dete.result, dete.message);
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

  doneTag = async (req, res) => {
    try {
      const { userId } = res.locals;
      const { scheduleId, date } = req.body;

      const receive = await TagService.done(userId, scheduleId, date);
      return res.status(receive.status).json(receive.message, receive.result);
    } catch (err) {
      res.status(err.status).send(err.message);
    }
  };
})();
