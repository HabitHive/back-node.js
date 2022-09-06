import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async (req, res, next) => {
  try {
    const refreshToken = req.session.a1;
    const refreshTokenVerify = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          console.log(err);
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

    req.session.a1 = newRefreshToken;
    req.session.save((err) => {
      if (err) {
        console.log(err);
        const error = new Error("session save error");
        error.name = "can not create session";
        error.status = 500;
        throw error;
      }
    });

    res.status(201).json({ token: newAccessToken });
  } catch (error) {
    if (error.status) {
      console.log(error);
      res.status(error.status).json({ message: error.name });
      return;
    }
    console.log(error);
    res.status(403).json({ message: error.name });
  }
};
