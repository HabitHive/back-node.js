import express from "express";
import User from "../../models/user.js";

const router = express.Router();

//signup
router.post("/test1", async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    await User.create({ email: email, password: password, nickname: nickname });
    const user = await User.findOne({
      where: { email: email, password: password },
      attributes: ["UserId"],
      raw: true,
    });
    req.session.User = user;
    req.session.save((err) => {
      if (err) {
        console.log(err);
        res.json({ result: false });
      }
      res.json({ result: user });
    });
  } catch (error) {
    res.json(error);
  }
});

//세션 부여
router.post("/test2", async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: ["UserId"],
      raw: true,
    });
    console.log(user);
    req.session.User = user;
    req.session.save((err) => {
      if (err) {
        console.log(err);
        res.json({ result: false });
      }
      res.json({ result: user });
    });
  } catch (error) {
    res.json(error);
  }
});

//세션값 확인
router.get("/test3", async (req, res) => {
  try {
    const user = req.session.User;
    if (user) {
      console.log(user);
      res.json({ result: user });
    } else res.json({ result: "not exist" });
  } catch (error) {
    res.json(error);
  }
});

//세션값 삭제
router.get("/test4", async (req, res) => {
  try {
    console.log(req.session.a1);
    if (req.session.a1) {
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          res.json({ result: err });
        }
        res.json({ result: true });
      });
    } else {
      res.json({ result: "not exist" });
    }
  } catch (error) {
    res.json(error);
  }
});

router.get("/test5", async (req, res) => {
  try {
    console.log(req.session.a4);
    res.json({ result: req.session });
  } catch (error) {
    res.json(error);
  }
});

export default router;
