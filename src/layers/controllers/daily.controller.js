import DailyService from "../services/daily.service.js";

export default new (class Dailycontroller {
  dailyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;
      const { todayDate } = req.query;
      // const todayDate = new Date();
      const result = await DailyService.dailyPage(userId, todayDate);

      return res.status(200).json({ result, message: "날짜에 맞는 태그 일정" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  tagList = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;

      const result = await DailyService.tagList(userId);

      return res.status(200).json({ result, message: "유저의 태그 목록" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  schedulePage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 1;
      const { userTagId } = req.params;

      const result = await DailyService.schedulePage(userId, userTagId);

      return res.status(200).json({ result, message: "태그의 유효기간" });
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

      const result = await DailyService.schedule(
        userId,
        userTagId,
        timeCycle,
        weekCycle,
        startDate
      );

      return res.status(200).json({ result, message: "내 태그 스케줄 추가" });
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
