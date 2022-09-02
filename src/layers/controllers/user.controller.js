import UserService from "../services/user.service.js";
import TagService from "../services/tag.service.js";

class UserController {
  //회원가입              /api/user/signup
  singup = async (req, res) => {
    try {
      const service_result = await UserService.singup(req.body);
      if (service_result) {
        const token = await UserService.login(
          req.body.email,
          req.body.password,
          req
        );
        res.status(201).json({ token: token });
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //로그인                /api/user/login
  login = async (req, res) => {
    try {
      const token = await UserService.login(
        req.body.email,
        req.body.password,
        req
      );
      res.status(201).json({ token: token });
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //로그 아웃             /api/user/logout
  logout = async (req, res) => {
    try {
      await UserService.logout(req);
      res.status(200).json({});
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //관심사 설정           /api/user/interest
  interest = async (req, res) => {
    try {
      await UserService.interest(req.body, res.locals.user_id);
      res.status(200).json({});
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //유저정보              /api/user/mypage/info
  myInfo = async (req, res) => {
    const { userId } = res.locals;

    try {
      const receive = await UserService.myInfo(userId);
      res
        .status(receive.status)
        .json({ message: receive.message, result: receive.result });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  };

  myTagList = async (req, res) => {
    const { userId } = res.locals;
    const { date } = req.body;
    try {
      const receive = await TagService.myTag(userId, date);
      res.status(receive.status).json({
        message: receive.message,
        result: receive.result,
      });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  };
}

export default new UserController();
