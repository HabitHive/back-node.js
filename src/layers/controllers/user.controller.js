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
      await UserService.interest(req.body, res.locals.user_id);
      res.status(201).json({});
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //유저정보              /api/user/mypage/info
  mp_info = async (req, res) => {};

  //현재 진행 중 태그     /api/user/mypage/still
  mp_still = async (req, res) => {};

  //완료된 태그           /api/user/mypage/end
  mp_end = async (req, res) => {};
}

export default new UserController();
