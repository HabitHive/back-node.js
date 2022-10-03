const DailyService = require("../services/daily.service");

module.exports = new (class Dailycontroller {
  dailyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { todayDate } = req.query;

      const data = await DailyService.dailyPage(userId, todayDate);

      return res
        .status(data.status)
        .json({ result: data.result, message: data.message });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  dailyTagList = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const data = await DailyService.tagList(userId);

      return res
        .status(data.status)
        .json({ result: data.result, message: data.message });
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

      const data = await DailyService.scheduleCreate(
        userId,
        userTagId / 1,
        startTime,
        endTime,
        weekCycle,
        startDate
      );

      return res
        .status(data.status)
        .json({ result: data.result, message: data.message });
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

      const data = await DailyService.scheduleUpdate(
        userId,
        scheduleId / 1,
        startTime,
        endTime,
        weekCycle,
        startDate
      );

      return res
        .status(data.status)
        .json({ result: data.result, message: data.message });
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

      const data = await DailyService.scheduleDelete(userId, scheduleId / 1);

      return res
        .status(date.status)
        .json({ result: data.result, message: data.message });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };
})();
