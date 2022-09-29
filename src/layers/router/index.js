const express = require("express");

const UserController = require("../controllers/user.controller");
const DailyController = require("../controllers/daily.controller");
const TagController = require("../controllers/tag.controller");
const PetController = require("../controllers/pet.controller");

const authMiddleware = require("../utils/auth.middleware");
// const reissuance = require("../utils/token.reissuance");

const router = express.Router();

/* /api/token */
// router.get("/token", reissuance); //엑세스 토큰 재발급

/* /api/user */
router.post("/user/signup", UserController.singUp); //회원가입
// router.delete("/user/signout", authMiddleware, UserController.signOut); //회원탈퇴
router.post("/user/login", UserController.logIn); //로그인
router.delete("/user/logout", UserController.logOut); //로그 아웃
router.put("/user/interest", authMiddleware, UserController.interest); //관심사 설정

router.post("/user/random", authMiddleware, UserController.randomPoint); //보상 - 랜덤 포인트 지급
router.get("/user/mypage/info", authMiddleware, UserController.myInfo); //유저정보
router.put("/user/mypage/tag", authMiddleware, UserController.myTagList); //유저 습관 전적
// router.post(
//   "/user/changepassword",
//   authMiddleware,
//   UserController.changePassWord
// ); //유저 비밀번호 변경

// router.post("/user/sendemail", UserController.findPassWord1); //비밀번호를 바꾸기위한 인증코드 발송
// router.post("/user/resetpassword", UserController.findPassWord2); //임시 비밀번호 적용 및 발급

/* /api/tag */
router.post("/tag/list", authMiddleware, TagController.tagBuyPage); // 습관 구매 페이지
router.post("/tag/buy", authMiddleware, TagController.tagBuy); // 습관을 구매하는 API
router.post("/mytag/create", authMiddleware, TagController.mytagCreate); // 나만의 습관을 만드는 API
router.post("/mytag/delete", authMiddleware, TagController.mytagDelete); // 나만의 습관을 삭제하는 API
router.get("/tag/daily", authMiddleware, DailyController.dailyPage); // 데일리 페이지
router.get("/tag/daily/list", authMiddleware, DailyController.dailyTagList); // 데일리 페이지 가지고있는 습관 목록
router.post("/tag/done", authMiddleware, TagController.doneTag); //습관 완료
router.post(
  "/tag/schedule/add/:userTagId", // 스케줄 생성
  authMiddleware,
  DailyController.scheduleCreate
);
router.patch(
  "/tag/schedule/update/:scheduleId", // 스케줄 수정
  authMiddleware,
  DailyController.scheduleUpdate
);
router.delete(
  "/tag/schedule/delete/:scheduleId", // 스케줄 삭제
  authMiddleware,
  DailyController.scheduleDelete
);
router.get("/tag/monthly/:date", authMiddleware, TagController.monthly);

/* /api/pet */
router.get("/pet", authMiddleware, PetController.getPetInfo);
router.post("/pet", authMiddleware, PetController.buyingPetExp);

/* /api/admin */
// 배포시 주석처리 또는 삭제
// const AdminService = require("../services/admin");
// router.post("/admin/input", AdminService.input);
// router.put("/admin/money", authMiddleware, AdminService.money);

module.exports = router;
