const express = require("express");

const UserController = require("../controllers/user.controller");
const DailyController = require("../controllers/daily.controller");
const TagController = require("../controllers/tag.controller");
const PetController = require("../controllers/pet.controller");

const authMiddleware = require("../utils/auth.middleware");

const router = express.Router();

/* /api/user */
router.post("/user/signup", UserController.singUp); //회원가입
router.post("/user/login", UserController.logIn); //로그인
router.get("/user/logout", UserController.logOut); //로그 아웃
router.put("/user/interest", authMiddleware, UserController.interest); //관심사 설정

router.get("/user/mypage/info", authMiddleware, UserController.myInfo); //유저정보
router.put("/user/mypage/tag", authMiddleware, UserController.myTagList); //유저 습관 전적

/* /api/tag */
router.get("/tag/list", authMiddleware, TagController.tagBuyPage);
router.post("/tag/buy", authMiddleware, TagController.tagBuy);
router.get("/tag/daily", authMiddleware, DailyController.dailyPage);
router.get("/tag/daily/list", authMiddleware, DailyController.dailyTagList);
router.post("/tag/done", authMiddleware, TagController.doneTag); //습관 완료
router.get(
  "/tag/schedule/add/:userTagId",
  authMiddleware,
  DailyController.schedulePage
);
router.post(
  "/tag/schedule/add/:userTagId",
  authMiddleware,
  DailyController.scheduleCreate
);
router.patch(
  "/tag/schedule/update/:scheduleId",
  authMiddleware,
  DailyController.scheduleUpdate
);
router.delete(
  "/tag/schedule/delete/:scheduleId",
  authMiddleware,
  DailyController.scheduleDelete
);
router.get("/tag/monthly/:date", authMiddleware, TagController.monthly);

/* /api/pet */
router.get("/pet", authMiddleware, PetController.getPetInfo);
router.post("/pet", authMiddleware, PetController.buyingPetExp);

const adminService = require("../services/admin");
router.post("/admin/input/tag", adminService.input);

module.exports = router;
