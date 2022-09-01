import DailyServices from "../services/daily.services.js";

export default class dailycontroller {
  dailyServices = new DailyServices();

  dailyPage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;
      const { todayDate } = req.query; //선택한 daily 날짜
      // const todayDate = new Date();
      const result = await this.dailyServices.dailyPage(userId, todayDate);

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

      const result = await this.dailyServices.tagList(userId);

      return res.status(200).json({ result, message: "유저의 태그 목록" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  schedulePage = async (req, res, next) => {
    // 지금 현재로는 필요하지 않은 로직; 나중에 수정에 사용 할지도.
    try {
      const { userId } = res.locals;
      // const userId = 1;
      const { userTagId } = req.params;

      const result = await this.dailyServices.schedulePage(userId, userTagId);

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
      const { startDate, timeCycle, weekCycle } = req.bady;

      const result = await this.dailyServices.schedule(
        userId,
        userTagId,
        startDate,
        timeCycle,
        weekCycle
      );
      return res.status(200).json({ result, message: "내 태그 스케줄 추가" });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };
}
