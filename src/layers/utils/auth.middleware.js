const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../../models/user");
dotenv.config();

module.exports = async (req, res, next) => {
  try {
    // 요청 헤더에서 토큰 값을 가지고 옴
    const { authorization } = req.headers; // 구조분해 할당
    if (!authorization) {
      const error = new Error("header not exist");
      error.name = "Header error";
      throw error;
    }

    const [tokenType, tokenValue] = (authorization || "").split(" ");
    const user = jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET); // 받아온 엑세스 토큰 값을 검증

    const existUser = await User.findOne({
      where: { user_id: user.key1 - parseInt(process.env.SUM) },
    }); // 유저아이디로 유저값 불러오기

    // 유저 있는지 확인하기 없으면 에러 throw
    if (existUser === null) {
      const error = new Error("user not exist");
      error.name = "User error";
      throw error;
    }

    // 엑세스 토큰 확인 잘못되면 에러 throw
    if (tokenType !== "Bearer") {
      const error = new Error("wrong token-type");
      error.name = "Token error";
      throw error;
    }

    // user에 user_id값이 없다면 에러 throw
    if (user.key1 === undefined) {
      const error = new Error("wrong token-value");
      error.name = "Token error";
      throw error;
    }

    // res.loclas로 user_id 넘겨줌
    res.locals.userId = user.key1 - parseInt(process.env.SUM);
    next();
  } catch (error) {
    res.status(401).json({ err_message: `${error.name}: ${error.message}` });
    return;
  }
};
