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
    if (sessionData === null) {
      const error = new Error("not exist session");
      error.name = "session error";
      throw error;
    }
    const refreshToken = sessionData.data.a1;
    const refreshTokenVerify = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          const error = new Error("verify token error");
          error.name = "invalid token";
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

    await Session.update(
      { data: { a1: newRefreshToken, cookie: sessionData.data.cookie } },
      { where: { session_id: session } }
    );

    res.status(201).json({ token: newAccessToken });
  } catch (error) {
    res.status(403).json({ name: error.name, message: error.message });
  }
};
