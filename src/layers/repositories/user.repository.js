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
        interest: "#",
        point: 0,
      });
      return true;
    }
  };

  //로그인                /api/user/login
  login = async (email) => {
    const find_user = await User.findOne({ where: { email }, raw: true });
    return find_user;
  };

  //관심사 설정           /api/user/interest
  interest = async (interest, user_id) => {
    await User.update({ interest }, { where: { user_id } });
  };

  findUser = async (user_id) => {
    const user = await User.findOne({
      where: { user_id },
      attributes: { exclude: ["password"] },
      raw: true,
    });
    return user;
  };

  findPoint = async (user_id) => {
    const user = await User.findOne({
      where: { user_id },
      attributes: ["point"],
      raw: true,
    });
    return user.point;
  };
}

export default new UserRepository();
