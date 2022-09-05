import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export default async (req, res, next) => {
  try {
    const refreshToken = req.session.a1;
    const refreshTokenVerify = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const newAccessToken = jwt.sign(
      { key1: refreshTokenVerify.key3 + parseInt(process.env.SUM) },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const newRefreshToken = jwt.sign(
      { key2: newAccessToken, key3: refreshTokenVerify.key3 },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: "7d",
      }
    );

    req.session.a1 = newRefreshToken;
    req.session.save((err) => {
      if (err) {
        throw err;
      }
    });

    res.status(201).json({ token: newAccessToken });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.name);
  }
};
