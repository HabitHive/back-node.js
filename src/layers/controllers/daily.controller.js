import DailyService from "../services/daily.service.js";

export default new (class Dailycontroller {
  dailyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
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

  dailyTagList = async (req, res, next) => {
    try {
      const { userId } = res.locals;
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

  scheduleCreate = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { userTagId } = req.params;
      const { startTime, endTime, weekCycle, startDate } = req.body;

      const date = await DailyService.scheduleCreate(
        userId,
        userTagId / 1,
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
    // 스케줄 자체의 업데이트의경우
    try {
      const { userId } = res.locals;
      const { scheduleId } = req.params;
      const { startTime, endTime, weekCycle, startDate } = req.body;

      const date = await DailyService.scheduleUpdate(
        userId,
        scheduleId,
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

  scheduleDelete = async (req, res, next) => {
    // 스케줄의 삭제 할때
    try {
      const { userId } = res.locals;
      const { scheduleId } = req.params;

      const date = await DailyService.scheduleDelete(userId, scheduleId);

      return res
        .status(date.status)
        .json({ result: date.result, message: date.message });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };
})();
