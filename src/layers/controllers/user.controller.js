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
  mp_info = async (req, res) => {
    try {
    } catch (error) {}
  };

  //현재 진행 중 태그     /api/user/mypage/still
  mp_still = async (req, res) => {
    try {
    } catch (error) {}
  };

  //완료된 태그           /api/user/mypage/end
  mp_end = async (req, res) => {
    try {
    } catch (error) {}
  };
}

export default new UserController();
