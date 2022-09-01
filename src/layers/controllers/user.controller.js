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
      await UserService.logout(req);
      res.status(200).json({});
    } catch (error) {
      console.log(error);
      res.status(400).send(error.message);
    }
  };

  //관심사 설정           /api/user/interest
  interest = async (req, res) => {};

  //유저정보              /api/user/mypage/info
  mp_info = async (req, res) => {};

  //현재 진행 중 태그     /api/user/mypage/still
  mp_still = async (req, res) => {};

  //완료된 태그           /api/user/mypage/end
  mp_end = async (req, res) => {};
}

export default new UserController();
