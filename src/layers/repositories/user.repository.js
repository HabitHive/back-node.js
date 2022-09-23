const User = require("../../models/user");
const Refresh = require("../../models/refresh");
const Point = require("../../models/point");
const { Op, where } = require("sequelize");

class UserRepository {
  //회원가입              /api/user/signup
  singUp = async (email, nickname, password) => {
    console.log(email, nickname, password);
    const exsistEmail = await User.findOne({
      where: { email, social: false },
    });
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
        social: false,
        provider: null,
      });
      return true;
    }
  };

  //로그인                /api/user/login
  logIn = async (email) => {
    const findUser = await User.findOne({
      where: { email, social: false },
      raw: true,
    });
    return findUser;
  };

  refresh = async (refresh_token) => {
    const refresh = await Refresh.create({ refresh_token });

    return refresh.dataValues.refresh_id;
  };

  //로그 아웃             /api/user/logout
  logOut = async (refresh_id) => {
    const refresh = await Refresh.findOne({ where: { refresh_id } });
    if (refresh) return 1;
    await Refresh.destroy({ where: { refresh_id } });
    return 0;
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

  colorHistory = async (user_id, thisMonth, nextMonth) => {
    const result = await Point.findAll({
      where: { user_id, date: { [Op.gte]: thisMonth, [Op.lt]: nextMonth } },
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

module.exports = new UserRepository();
