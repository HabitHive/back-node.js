import express from "express";
import SocialLogin from "../controllers/sociallogin.controller.js";

const router = express.Router();

/* /api/naver */
router.get("/naver", SocialLogin.Naver);
router.get(
  "/naver/callback",
  SocialLogin.NaverCallBack,
  SocialLogin.ResponseToken
);

/* /api/google */
router.get("/google", SocialLogin.Google);
router.get(
  "/google/callback",
  SocialLogin.GoogleCallBack,
  SocialLogin.ResponseToken
);

/* /api/kakao */
router.get("/kakao", SocialLogin.Kakao);
router.get(
  "/kakao/callback",
  SocialLogin.KakaoCallBack,
  SocialLogin.ResponseToken
);

export default router;
