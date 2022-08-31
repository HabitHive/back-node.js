import UserService from "../services/user.service.js";

class UserController {
  //회원가입              /api/user/signup
  singup = async (req, res) => {
    try {
      const result = await UserService.singup(req.body);
      if (result === true) {
        const token = await UserService.login(
          req.body.email,
          req.body.password,
          req
        );
        res.status(201).json(token);
      }
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //로그인                /api/user/login
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      const token = await UserService.login(email, password, req);
      res.status(201).json(token);
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //로그 아웃             /api/user/logout
  logout = async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //관심사 설정           /api/user/interest
  interest = async (req, res) => {};

  //유저정보              /api/user/mypage/info
  mypageInfo = async (req, res) => {
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

  //현재 진행 중 태그     /api/user/mypage/still
  mypageStillTag = async (req, res) => {
    const { userId } = res.locals;
    try {
      const receive = await UserService.stillTag();
      res
        .status(receive.status)
        .json({ message: receive.message, result: receive.result });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  };

  //완료된 태그           /api/user/mypage/end
  mypageDoneTag = async (req, res) => {
    const { userId } = res.locals;
    try {
      const receive = await UserService.doneTag();
      res
        .status(receive.status)
        .json({ message: receive.message, result: receive.result });
    } catch (error) {
      res.status(error.status).json({ message: error.message });
    }
  };
}

export default new UserController();
