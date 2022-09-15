import express from "express";
import SocailLogin from "../controllers/sociallogin.controller.js";

const router = express.Router();

/* /api/naver */
router.get("/naver", SocailLogin.Naver);
router.get(
  "/naver/callback",
  SocailLogin.NaverCallBack,
  SocailLogin.ResponseToken
);

/* /api/google */
router.get("/google", SocailLogin.Google);
router.get(
  "/google/callback",
  SocailLogin.GoogleCallBack,
  SocailLogin.ResponseToken
);

/* /api/kakao */
router.get("/kakao", SocailLogin.Kakao);
router.get(
  "/kakao/callback",
  SocailLogin.KakaoCallBack,
  SocailLogin.ResponseToken
);

export default router;
