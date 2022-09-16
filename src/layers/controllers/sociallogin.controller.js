import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class SocialLogin {
  //? /kakao로 요청오면, 카카오 로그인 페이지로 가게 되고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
  // router.get("/kakao", passport.authenticate("kakao"));
  Kakao = passport.authenticate("kakao");

  //? 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
  // router.get("/kakao/callback", passport.authenticate("kakao",{option}));
  KakaoCallBack = passport.authenticate("kakao", {
    // successRedirect: "/", // kakaoStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: process.env.CLIENT, // kakaoStrategy에서 실패한다면 이 주소로 이동
    // successFlash: "성공적", // 성공시 플래시 메시지 출력
    // failureFlash: true, //실패시 플래시 메시지 출력여부
  });

  Google = passport.authenticate("google", { scope: ["profile", "email"] });

  GoogleCallBack = passport.authenticate("google", {
    // successRedirect: "/", // kakaoStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: process.env.CLIENT, // kakaoStrategy에서 실패한다면 이 주소로 이동
    // successFlash: "성공적", // 성공시 플래시 메시지 출력
    // failureFlash: true, //실패시 플래시 메시지 출력여부
  });

  Naver = passport.authenticate("naver");

  NaverCallBack = passport.authenticate("naver", {
    // successRedirect: "/", // kakaoStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: process.env.CLIENT, // kakaoStrategy에서 실패한다면 이 주소로 이동
    // successFlash: "성공적", // 성공시 플래시 메시지 출력
    // failureFlash: true, //실패시 플래시 메시지 출력여부
  });

  ResponseToken = (req, res) => {
    if (req.user) {
      const accessToken = jwt.sign(
        { key1: req.user + parseInt(process.env.SUM) },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { key2: accessToken, key3: req.user },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      req.session.a1 = refreshToken;
      req.session.save();
      res.redirect(
        `${process.env.CLIENT}?token=${accessToken}&session=${req.sessionID}`
      );
      return;
    }
    res.redirect(process.env.CLIENT);
  };
}

export default new SocialLogin();
