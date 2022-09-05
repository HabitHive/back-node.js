import UserService from "../services/user.service.js";

class UserController {
  //회원가입              /api/user/signup
  singUp = async (req, res) => {
    try {
      const service_result = await UserService.singUp(req.body);
      if (service_result) {
        const token = await UserService.logIn(
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
  logIn = async (req, res) => {
    try {
      const token = await UserService.logIn(
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
  logOut = async (req, res) => {
    try {
      await UserService.logOut(req);
      res.status(200).json({});
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //관심사 설정           /api/user/interest
  interest = async (req, res) => {
    try {
      await UserService.interest(req.body, res.locals.userId);
      res.status(201).json({});
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //유저정보              /api/user/mypage/info
  myInfo = async (req, res) => {
    const { userId } = res.locals;

    const receive = await UserService.myInfo(userId);
    res
      .status(receive.status)
      .json({ message: receive.message, result: receive.result });
  };

  //유저 태그 리스트         /api/user/mypage/tag
  myTagList = async (req, res) => {
    const { userId } = res.locals;
    const date = new Date(req.body.date);

    const receive = await UserService.myTag(userId, date);
    res.status(receive.status).json({
      message: receive.message,
      result: receive.result,
    });
  };
}

export default new UserController();
