import DailyService from "../services/daily.service.js";

export default new (class Dailycontroller {
  // 선택한 todayDate 에 대해서 스케줄을 가지고 있는 list을
  dailyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;
      const { todayDate } = req.query;
      // const todayDate = new Date();
      const dete = await DailyService.dailyPage(userId, todayDate);

      return res.status(dete.status).json(dete.result, dete.message);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  tagList = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;

      const dete = await DailyService.tagList(userId);

      return res.status(dete.status).json(dete.result, dete.message);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  // 나중에 스케줄 페이지가 필요하게 되었을 때
  schedulePage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 1;
      const { userTagId } = req.params;

      const dete = await DailyService.schedulePage(userId, userTagId);

      return res.status(dete.status).json(dete.result, dete.message);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  schedule = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { userTagId } = req.params;
      const { timeCycle, weekCycle, startDate } = req.bady;

      const dete = await DailyService.schedule(
        userId,
        userTagId,
        timeCycle,
        weekCycle,
        startDate
      );

      return res.status(dete.status).json(dete.result, dete.message);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  scheduleUpdate = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { scheduleId } = req.params;
      const { timeCycle, weekCycle, todayDate } = req.bady;
      // todayDate는 언제 부터 스케줄을 변경 할 것인지
      const dete = await DailyService.scheduleUpdate(
        userId,
        scheduleId,
        timeCycle,
        weekCycle,
        todayDate
      );

      return res.status(dete.status).json(dete.result, dete.message);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  doneTag = async (req, res) => {
    try {
      const { userId } = res.locals;
      const { scheduleId } = req.body;

      const receive = await DailyService.done(userId, scheduleId);
    } catch (err) {
      res.status(err.status).send(err.message);
    }
  };
})();
