const User = require("../../models/user");
const Refresh = require("../../models/refresh");
const Point = require("../../models/point");
const { Op, where } = require("sequelize");

class UserRepository {
  singUp = async (email) => {
    const exsistEmail = await User.findOne({
      where: { email, social: false },
    });
    if (exsistEmail) {
      return 1;
    } else {
      return 0;
    }
  };

  createAccount = async (email, nickname, password) => {
    await User.create({
      email,
      password,
      nickname,
      social: false,
      provider: null,
    });
  };

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

  logOut = async (refresh_id) => {
    const refresh = await Refresh.findOne({ where: { refresh_id } });
    if (refresh) return 1;
    await Refresh.destroy({ where: { refresh_id } });
    return 0;
  };

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

  existRandomHistory = async (user_id, date) => {
    const count = await Point.count({ where: { user_id, date } });
    return count;
  };

  createRandomHistory = async (user_id, date, point) => {
    const result = await Point.create({ user_id, date, point });
    return result;
  };

  findPassWord1 = async (email) => {
    const result = await User.findOne({ where: { email, social: false } });
    return result;
  };

  updateVerify = async (email, randomString) => {
    await User.update(
      { verify: randomString },
      { where: { email, social: false } }
    );
  };

  findVerify = async (verify) => {
    const result = await User.findOne({ where: { verify }, raw: true });
    return result;
  };

  temporaryPW = async (verify, password) => {
    await User.update({ password }, { where: { verify } });
  };

  changePassWord = async (user_id, password) => {
    await User.update({ password }, { where: { user_id } });
  };

  signOut = async (user_id) => {
    await User.destroy({ where: { user_id } });
  };
}

module.exports = new UserRepository();
