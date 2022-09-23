const jwt = require("jsonwebtoken");
const Refresh = require("../../models/refresh");
const dotenv = require("dotenv");

dotenv.config();

module.exports = async (req, res, next) => {
  try {
    const { refresh } = req.headers;
    const refreshId = parseInt(refresh) - parseInt(process.env.SUM2);
    const refreshData = await Refresh.findOne({
      where: { refresh_id: refreshId },
      raw: true,
    });
    if (refreshData === null) {
      const error = new Error("not exist token");
      error.name = "Token error";
      throw error;
    }
    const refreshToken = refreshData.refresh_token;
    const refreshTokenVerify = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          const error = new Error("invalid token");
          error.name = "Token error";
          throw err;
        }
        return decoded;
      }
    );

    const newAccessToken = jwt.sign(
      { key1: refreshTokenVerify.key2 + parseInt(process.env.SUM) },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "12h" }
    );

    const newRefreshToken = jwt.sign(
      { key2: refreshTokenVerify.key2 },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await Refresh.update(
      { newRefreshToken },
      { where: { refresh_id: refreshId } }
    );

    res.status(201).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    res.status(403).json({ err_message: `${error.name}: ${error.message}` });
  }
};
