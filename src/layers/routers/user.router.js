import express from "express";
import UserController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/signup", UserController.singup); //회원가입
router.post("/login", UserController.login); //로그인
router.delete("/logout", UserController.logout); //로그 아웃
router.put("/interest", UserController.interest); //관심사 설정
router.get("/mypage/info", UserController.mypageInfo); //유저정보
router.get("/mypage/still", UserController.mypageStillTag); //현재 진행 중 태그
router.get("/mypage/end", UserController.mypageDoneTag); //완료된 태그

export default router;
