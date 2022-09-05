import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async (req, res, next) => {
  // 요청 헤더에서 토큰 값을 가지고 옴
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = (authorization || "").split(" "); // 구조분해 할당

  if (tokenType !== "Bearer") {
    const error = new Error("Token error");
    error.name = "wrong Token";
    throw error;
  }

  try {
    // 받아온 토큰 값을 검증해서 user에 저장
    const user = jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET);

    // res.loclas로 넘겨줌
    res.locals.user_id = user.key1;
    next();
  } catch (error) {
    console.log(error);
    res.status(400).send(error.name);
    return;
  }
};
