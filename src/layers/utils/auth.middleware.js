import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../../models/user.js";
dotenv.config();

export default async (req, res, next) => {
  try {
    // 요청 헤더에서 토큰 값을 가지고 옴
    const { authorization } = req.headers; // 구조분해 할당
    const [tokenType, tokenValue] = (authorization || "").split(" ");
    const refreshToken = req.session.a1; // 리프레쉬 토큰값
    const user = jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET); // 받아온 엑세스 토큰 값을 검증해서 user에 저장
    const verifyUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          console.log(err);
          const error = new Error("verify token error");
          error.name = "invalid token";
          error.status = 500;
          throw error;
        }
        return decoded;
      }
    ); // 받아온 리프레쉬 토큰 값을 검증해서 verifyUser에 저장
    const existUser = await User.findOne({
      where: { user_id: user.key1 - parseInt(process.env.SUM) },
    }); // 유저아이디로 유저값 불러오기

    // 엑세스 토큰 확인 잘못되면 에러 throw
    if (tokenType !== "Bearer") {
      const error = new Error("Token error");
      error.name = "wrong token";
      throw error;
    }

    // 세션 확인 없다면 에러 throw
    if (req.session.a1 === undefined) {
      const error = new Error("Session error");
      error.name = "not login";
      throw error;
    }

    // 처음 발급한 엑세스 토큰값이랑 비교 후 틀리다면 에러 반환
    if (tokenValue !== verifyUser.key2) {
      const error = new Error("Token error");
      error.name = "does not match token";
      throw error;
    }

    // user에 user_id값이 없다면 에러 throw
    if (user.key1 === undefined) {
      const error = new Error("Token error");
      error.name = "wrong token";
      throw error;
    }

    // 유저 있는지 확인하기 없으면 에러 throw
    if (existUser === null) {
      const error = new Error("User error");
      error.name = "can not find user";
      throw error;
    }

    // res.loclas로 user_id 넘겨줌
    res.locals.userId = user.key1 - parseInt(process.env.SUM);
    next();
  } catch (error) {
    res.status(401).json({ message: error.name });
    return;
  }
};
