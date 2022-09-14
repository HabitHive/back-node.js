import DailyService from "../services/daily.service.js";

export default new (class Dailycontroller {
  // 선택한 todayDate 에 대해서 스케줄을 가지고 있는 list을
  dailyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;
      const { todayDate } = req.query;

      const date = await DailyService.dailyPage(userId, todayDate);

      return res
        .status(date.status)
        .json({ result: date.result, message: date.message });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  tagList = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;
      const date = await DailyService.tagList(userId);

      return res
        .status(date.status)
        .json({ result: date.result, message: date.message });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  // 스케줄을  만들 때
  schedulePage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 1;
      const { userTagId } = req.params;

      const date = await DailyService.schedulePage(userId, userTagId);

      return res
        .status(date.status)
        .json({ result: date.result, message: date.message });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  schedule = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;
      const { userTagId } = req.params;
      const { startTime, endTime, weekCycle, startDate } = req.body;

      const date = await DailyService.schedule(
        userId,
        userTagId,
        startTime,
        endTime,
        weekCycle,
        startDate
      );

      return res
        .status(date.status)
        .json({ result: date.result, message: date.message });
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
      const date = await DailyService.scheduleUpdate(
        userId,
        scheduleId,
        timeCycle,
        weekCycle,
        todayDate
      );

      return res
        .status(date.status)
        .json({ result: date.result, message: date.message });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };
})();
