import User from "../../models/user.js";

class UserRepository {
  //회원가입              /api/user/signup
  singUp = async (email, nickname, password) => {
    const exsistEmail = await User.findOne({ where: { email } });
    if (exsistEmail) {
      throw new Error("exsist email");
    } else {
      await User.create({
        email,
        password,
        nickname,
        interest: "#",
        point: 0,
      });
      return true;
    }
  };

  //로그인                /api/user/login
  logIn = async (email) => {
    const findUser = await User.findOne({ where: { email }, raw: true });
    return findUser;
  };

  //관심사 설정           /api/user/interest
  interest = async (interest, user_id) => {
    await User.update({ interest }, { where: { user_id } });
  };

  //유저정보              /api/user/mypage/info
  mp_info = async () => {};

  //현재 진행 중 태그     /api/user/mypage/still
  mp_still = async () => {};

  //완료된 태그           /api/user/mypage/end
  mp_end = async () => {};
}

export default new UserRepository();
