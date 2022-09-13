import User from "../../models/user.js";
import Point from "../../models/point.js";
import { Op } from "sequelize";

class UserRepository {
  //회원가입              /api/user/signup
  singUp = async (email, nickname, password) => {
    const exsistEmail = await User.findOne({ where: { email, social: false } });
    if (exsistEmail) {
      const error = new Error("account error");
      error.name = "exsist email";
      error.status = 403;
      throw error;
    } else {
      await User.create({
        email,
        password,
        nickname,
        interest: "#",
        point: 0,
        social: false,
        provider: null,
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

  updatePoint = async (user_id, point) => {
    const result = await User.update({ point }, { where: { user_id } });
    return result;
  };

  existHistory = async (user_tag_id, date) => {
    const history = await Point.findOne({ where: { user_tag_id, date } });
    return history;
  };

  colorHistory = async (user_id, date) => {
    const result = await Point.findAll({
      where: { user_id, date: { [Op.like]: `${date}%` } },
      raw: true,
    });
    return result;
  };

  countHistory = async (user_tag_id) => {
    const count = await Point.count({ where: { user_tag_id } });
    return count;
  };

  createHistory = async (user_id, point, date, user_tag_id) => {
    const result = await Point.create({ user_id, point, date, user_tag_id });
    return result;
  };
}

export default new UserRepository();
