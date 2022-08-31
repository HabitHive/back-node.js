import Dailyservices from "../services/daily.services.js";

class dailycontroller {
  dailyservices = new Dailyservices();

  dailypage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { todayDate } = req.query;

      const result = await this.dailyservices.dailypage(userId, todayDate);
    } catch {}
  };

  taglist = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 2;

      const result = await this.dailyservices.taglist(userId);
      return res.status(200).json({ result, message: "유저의 태그 목록" });
    } catch {}
  };

  schedulepage = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      // const userId = 1;
      const { usertagId } = req.params;

      const result = await this.dailyservices.schedulepage(userId, usertagId);
      return res.status(200).json({ result, message: "태그의 유효기간" });
    } catch {}
  };

  schedule = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { usertagId } = req.params;
      const { timeCycle, weekCycle } = req.bady;

      const result = await this.dailyservices.schedule(
        userId,
        usertagId,
        timeCycle,
        weekCycle
      );
      return res.status(200).json({ result, message: "내 태그 스케줄 추가" });
    } catch {}
  };
}

export default dailycontroller;
