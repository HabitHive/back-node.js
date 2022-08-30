import User from "../../models/user.js";

class UserRepository {
  //회원가입              /api/user/signup
  singup = async (email, nickname, hashedpassword) => {
    const exsistemail = await User.findOne({ where: { email } });
    if (exsistemail) {
      throw new Error("exsistemail");
    } else {
      await User.create({
        email,
        password: hashedpassword,
        nickname,
      });
      return true;
    }
  };

  //로그인                /api/user/login
  login = async (email) => {
    const result = await User.findOne({ where: { email }, raw: true });
    return result;
  };

  //로그 아웃             /api/user/logout
  logout = async () => {};

  //관심사 설정           /api/user/interest
  interest = async () => {};

  //유저정보              /api/user/mypage/info
  mp_info = async () => {};

  //현재 진행 중 태그     /api/user/mypage/still
  mp_still = async () => {};

  //완료된 태그           /api/user/mypage/end
  mp_end = async () => {};
}

export default new UserRepository();
