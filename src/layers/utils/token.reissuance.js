import jwt from "jsonwebtoken";
import Session from "../../models/session.js";
import dotenv from "dotenv";

dotenv.config();

export default async (req, res, next) => {
  try {
    const { session } = req.headers;
    const sessionData = await Session.findOne({
      where: { session_id: session },
      raw: true,
    });
    console.log(session);
    console.log(sessionData);
    const refreshToken = sessionData.data.a1;
    const refreshTokenVerify = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          const error = new Error("verify token error");
          error.name = "invalid token";
          error.status = 403;
          throw error;
        }
        return decoded;
      }
    );

    const newAccessToken = jwt.sign(
      { key1: refreshTokenVerify.key3 + parseInt(process.env.SUM) },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const newRefreshToken = jwt.sign(
      { key2: newAccessToken, key3: refreshTokenVerify.key3 },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const result = await Session.update(
      { data: { a1: newRefreshToken, cookie: sessionData.data.cookie } },
      { where: { session_id: session } }
    );

    console.log(result);

    res.status(201).json({ token: newAccessToken });
  } catch (error) {
    if (error.status) {
      res.status(error.status).json({ message: error.name });
      return;
    }
    res.status(403).json({ message: error.name });
  }
};
