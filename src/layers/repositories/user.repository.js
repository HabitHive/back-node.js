import User from "../../models/user.js";

class UserRepository {
  findOneUser = async (userId) => {
    return await User.findOne({ where: { userId } });
  };
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
