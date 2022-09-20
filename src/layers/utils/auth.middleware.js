const dotenv = require("dotenv");
const Session = require("../../models/session");
dotenv.config();

module.exports = async (req, res, next) => {
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
    const userId = sessionData.data.a1;

    // res.loclas로 user_id 넘겨줌
    res.locals.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ name: error.name, message: error.message });
    return;
  }
};
