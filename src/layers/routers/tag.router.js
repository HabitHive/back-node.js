import express from "express";
import dailycontroller from "../controllers/daily.controller.js";
const router = express.Router();

router.get("/list");
router.post("/buy?tagname=");
router.get("/dailytag?todayDate=", dailycontroller.dailypage);
router.get("/dailytag/list", dailycontroller.taglist);
router.post("/schedule/add", dailycontroller.schedule);

export default router;
