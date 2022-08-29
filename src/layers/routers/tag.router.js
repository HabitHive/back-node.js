import express from "express";
import dailycontroller from "../controllers/daily.controller.js";
const router = express.Router();

router.get("/list", )
router.post("/buy?tagname=", )
router.get("/dailytag?todayDate=", dailycontroller)
router.get("/dailytag/list", dailycontroller)
router.post("/schedule/add", dailycontroller)

export default router;