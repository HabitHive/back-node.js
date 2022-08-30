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

  schedule = async (req, res, next) => {
    try {
      const { userId } = res.locals;
      const { usertagId } = req.params;
      const { currentDate } = req.bady;

      const result = await this.dailyservices.schedule(
        userId,
        usertagId,
        currentDate
      );
    } catch {}
  };
}

export default dailycontroller;
