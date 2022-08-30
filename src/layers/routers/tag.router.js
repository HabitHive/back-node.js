import express from "express";
import Dailycontroller from "../controllers/daily.controller.js";
import Tagcontroller from "../controllers/tag.controller.js";
const router = express.Router();
const dailycontroller = new Dailycontroller();
const tagcontroller = new Tagcontroller();

router.get("/list", tagcontroller.buypage);
router.post("/buy", tagcontroller.tagbuy);
router.get("/dailytag", dailycontroller.dailypage);
router.get("/dailytag/list", dailycontroller.taglist);
router.get("/schedule/add/:usertagId", dailycontroller.schedulepage);
router.post("/schedule/add/:usertagId", dailycontroller.schedule);

export default router;
