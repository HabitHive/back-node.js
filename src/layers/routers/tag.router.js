import express from "express";
import Dailycontroller from "../controllers/daily.controller.js";
const router = express.Router();
const dailycontroller = new Dailycontroller();

router.get("/list");
router.post("/buy");
router.get("/dailytag", dailycontroller.dailypage);
router.get("/dailytag/list", dailycontroller.taglist);
router.get("/schedule/add/:usertagId", dailycontroller.schedulepage);
router.post("/schedule/add/:usertagId", dailycontroller.schedule);

export default router;
