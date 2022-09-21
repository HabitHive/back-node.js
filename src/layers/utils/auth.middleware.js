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
    //  sessionData.data이 문자열로 올때가 있고 객체로 올때가 있다 왜???
    let userId = "";
    if (typeof sessionData.data == "string") {
      userId = JSON.parse(sessionData.data).a1;
    } else {
      userId = sessionData.data.a1;
    }

    // res.loclas로 user_id 넘겨줌
    res.locals.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ name: error.name, message: error.message });
    return;
  }
};
