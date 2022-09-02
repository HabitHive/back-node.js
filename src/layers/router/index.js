import express from "express";

import UserController from "../controllers/user.controller.js";
import DailyController from "../controllers/daily.controller.js";
import TagController from "../controllers/tag.controller.js";
import PetController from "../controllers/pet.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// /* /api/user */
// router.post("/user/signup", UserController.singup); //회원가입
// router.post("/user/login", UserController.login); //로그인
// router.delete("/user/logout", UserController.logout); //로그 아웃
// router.put("/user/interest", authMiddleware, UserController.interest); //관심사 설정

// router.get("/user/mypage/info", UserController.myInfo); //유저정보
// router.get("/user/mypage/tag", UserController.myTagList); //유저 태그 정보

// /* /api/tag */
// router.get("/tag/list", TagController.buyPage);
// router.post("/tag/buy", TagController.tagBuy);
// router.get("/tag/dailytag", DailyController.dailyPage);
// router.get("/tag/dailytag/list", DailyController.tagList);
// router.get("/tag/schedule/add/:usertagId", DailyController.schedulePage);
// router.post("/tag/schedule/add/:usertagId", DailyController.schedule);

// /* /api/pet */
// router.get("/pet", PetController.getPetInfo);
// router.post("/pet", PetController.buyingPetExp);

export default router;
