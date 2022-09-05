import express from "express";

import UserController from "../controllers/user.controller.js";
import DailyController from "../controllers/daily.controller.js";
import TagController from "../controllers/tag.controller.js";
import PetController from "../controllers/pet.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/* /api/user */
router.post("/user/signup", UserController.singUp); //회원가입
router.post("/user/login", UserController.logIn); //로그인
router.delete("/user/logout", UserController.logOut); //로그 아웃
router.put("/user/interest", authMiddleware, UserController.interest); //관심사 설정

router.get("/user/mypage/info", authMiddleware, UserController.myInfo); //유저정보
router.get("/user/mypage/tag", authMiddleware, UserController.myTagList); //유저 태그 정보

/* /api/tag */
router.get("/tag/list", authMiddleware, TagController.buyPage);
router.post("/tag/buy", authMiddleware, TagController.tagBuy);
router.get("/tag/dailytag", authMiddleware, DailyController.dailyPage);
router.get("/tag/dailytag/list", authMiddleware, DailyController.tagList);
router.post("/tag/daily-tag/done", authMiddleware, TagController.doneTag);
router.get(
  "/tag/schedule/add/:usertagId",
  authMiddleware,
  DailyController.schedulePage
);
router.post(
  "/tag/schedule/add/:usertagId",
  authMiddleware,
  DailyController.schedule
);

/* /api/pet */
router.get("/pet", authMiddleware, PetController.getPetInfo);
router.post("/pet", authMiddleware, PetController.buyingPetExp);

export default router;
