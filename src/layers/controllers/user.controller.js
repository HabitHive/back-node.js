const UserService = require("../services/user.service");

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
        res.status(201).json({
          accessToken: token.accessToken,
          // refreshToken: token.refreshToken,
        });
      }
    } catch (error) {
      if (error.status) {
        res
          .status(error.status)
          .json({ err_message: `${error.name}: ${error.message}` });
        return;
      }
      res.status(400).json({ err_message: `${error.name}: ${error.message}` });
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
      res.status(201).json({
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
      });
    } catch (error) {
      if (error.status) {
        res
          .status(error.status)
          .json({ err_message: `${error.name}: ${error.message}` });
        return;
      }
      res.status(400).json({ err_message: `${error.name}: ${error.message}` });
    }
  };

  //로그 아웃             /api/user/logout
  logOut = async (req, res) => {
    try {
      await UserService.logOut(req);
      res.status(200).json({ message: "success" });
    } catch (error) {
      if (error.status) {
        res
          .status(error.status)
          .json({ err_message: `${error.name}: ${error.message}` });
        return;
      }
      res.status(400).json({ err_message: `${error.name}: ${error.message}` });
    }
  };

  //관심사 설정           /api/user/interest
  interest = async (req, res) => {
    try {
      await UserService.interest(req.body, res.locals.userId);
      res.status(201).json({ message: "success" });
    } catch (error) {
      if (error.status) {
        res
          .status(error.status)
          .json({ err_message: `${error.name}: ${error.message}` });
        return;
      }
      res.status(400).json({ err_message: `${error.name}: ${error.message}` });
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

    const receive = await UserService.myTag(userId);
    res
      .status(receive.status)
      .json({ message: receive.message, result: receive.result });
  };

  //랜덤 포인트 지급          /api/user/random
  randomPoint = async (req, res) => {
    const { userId } = res.locals;

    const receive = await UserService.randomPoint(userId);
    res
      .status(receive.status)
      .json({ message: receive.message, result: receive.result });
  };

  //비밀 번호 찾기 1 인증코드 발급
  findPassWord1 = async (req, res) => {
    try {
      const { email } = req.body;
      await UserService.findPassWord1(email);
      res.status(200).json({ message: "success" });
    } catch (error) {
      if (error.status) {
        res
          .status(error.status)
          .json({ err_message: `${error.name}: ${error.message}` });
        return;
      }
      res.status(400).json({ err_message: `${error.name}: ${error.message}` });
    }
  };

  //비밀 번호 찾기 2 인증코드 확인
  findPassWord2 = async (req, res) => {
    try {
      const { verify } = req.body;
      await UserService.findPassWord2(verify);
      res.status(201).json({ message: "success" });
    } catch (error) {
      if (error.status) {
        res
          .status(error.status)
          .json({ err_message: `${error.name}: ${error.message}` });
        return;
      }
      res.status(400).json({ err_message: `${error.name}: ${error.message}` });
    }
  };
}

module.exports = new UserController();
