import express from "express";

import UserController from "../controllers/user.controller.js";
import DailyController from "../controllers/daily.controller.js";
import TagController from "../controllers/tag.controller.js";
import PetController from "../controllers/pet.controller.js";
import SocailLogin from "../controllers/sociallogin.controller.js";

import authMiddleware from "../utils/auth.middleware.js";
import reissuance from "../utils/token.reissuance.js";

const router = express.Router();

/* /api/kakao */
router.get("/kakao", SocailLogin.Kakao);
router.get(
  "/kakao/callback",
  SocailLogin.KakaoCallBack,
  SocailLogin.ResponseToken
);

/* /api/token */
router.get("/token", reissuance); //엑세스 토큰 재발급

/* /api/user */
router.post("/user/signup", UserController.singUp); //회원가입
router.post("/user/login", UserController.logIn); //로그인
router.get("/user/logout", UserController.logOut); //로그 아웃
router.put("/user/interest", authMiddleware, UserController.interest); //관심사 설정

router.get("/user/mypage/info", authMiddleware, UserController.myInfo); //유저정보
router.get("/user/mypage/tag", authMiddleware, UserController.myTagList); //유저 습관 전적

/* /api/tag */
router.get("/tag/list", authMiddleware, TagController.buyPage);
router.post("/tag/buy/:tagId", authMiddleware, TagController.tagBuy);
router.get("/tag/daily", authMiddleware, DailyController.dailyPage);
router.get("/tag/daily/list", authMiddleware, DailyController.tagList);
router.post("/tag/done", authMiddleware, TagController.doneTag); //습관 완료
router.get(
  "/tag/schedule/add/:userTagId",
  authMiddleware,
  DailyController.schedulePage
);
router.post(
  "/tag/schedule/add/:userTagId",
  authMiddleware,
  DailyController.schedule
);

/* /api/pet */
router.get("/pet", authMiddleware, PetController.getPetInfo);
router.post("/pet", authMiddleware, PetController.buyingPetExp);

export default router;
