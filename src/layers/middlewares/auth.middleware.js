import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../../models/user.js";
dotenv.config();

export default async (req, res, next) => {
  try {
    // 요청 헤더에서 토큰 값을 가지고 옴
    const { authorization } = req.headers;
    const [tokenType, tokenValue] = (authorization || "").split(" "); // 구조분해 할당

    if (tokenType !== "Bearer") {
      const error = new Error("Token error");
      error.name = "wrong Token";
      throw error;
    }

    // 받아온 토큰 값을 검증해서 user에 저장
    const user = jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET);
    // user에 user_id값이 없다면 에러 throw
    if (user.key1 === undefined) {
      const error = new Error("Token error");
      error.name = "wrong Token";
      throw error;
    }
    // 유저아이디로 유저값 불러오기
    const existUser = await User.findOne({ where: { user_id: user.key1 } });
    // 유저 있는지 확인하기 없으면 에러 throw
    if (existUser === null) {
      const error = new Error("User error");
      error.name = "can not find user";
      throw error;
    }

    // res.loclas로 user_id 넘겨줌
    res.locals.user_id = user.key1;
  } catch (error) {
    console.log(error.name);
    res.status(400).send("로그인 또는 회원가입을 해주세요");
    return;
  }
};
