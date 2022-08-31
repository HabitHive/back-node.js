import UserService from "../services/user.service.js";

class UserController {
  //회원가입              /api/user/signup
  singup = async (req, res) => {
    try {
      const { email, password, nickname } = req.body;
    } catch (error) {}
  };

  //로그인                /api/user/login
  login = async (req, res) => {
    try {
    } catch (error) {}
  };

  //로그 아웃             /api/user/logout
  logout = async (req, res) => {
    try {
    } catch (error) {}
  };

  //관심사 설정           /api/user/interest
  interest = async (req, res) => {
    try {
    } catch (error) {}
  };

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
