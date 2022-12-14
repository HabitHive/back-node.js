const passport = require("passport");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Refresh = require("../../models/refresh");
dotenv.config();

class SocialLogin {
  //? /kakao로 요청오면, 카카오 로그인 페이지로 가게 되고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
  // router.get("/kakao", passport.authenticate("kakao"));
  Kakao = passport.authenticate("kakao");

  //? 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
  // router.get("/kakao/callback", passport.authenticate("kakao",{option}));
  KakaoCallBack = passport.authenticate("kakao", {
    // successRedirect: "/", // kakaoStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: "https://www.habit-rabbit.shop/", // kakaoStrategy에서 실패한다면 이 주소로 이동
    // successFlash: "성공적", // 성공시 플래시 메시지 출력
    // failureFlash: true, //실패시 플래시 메시지 출력여부
  });

  Google = passport.authenticate("google", { scope: ["profile", "email"] });

  GoogleCallBack = passport.authenticate("google", {
    // successRedirect: "/", // kakaoStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: "https://www.habit-rabbit.shop/", // kakaoStrategy에서 실패한다면 이 주소로 이동
    // successFlash: "성공적", // 성공시 플래시 메시지 출력
    // failureFlash: true, //실패시 플래시 메시지 출력여부
  });

  Naver = passport.authenticate("naver");

  NaverCallBack = passport.authenticate("naver", {
    // successRedirect: "/", // kakaoStrategy에서 성공한다면 이 주소로 이동
    failureRedirect: "https://www.habit-rabbit.shop/", // kakaoStrategy에서 실패한다면 이 주소로 이동
    // successFlash: "성공적", // 성공시 플래시 메시지 출력
    // failureFlash: true, //실패시 플래시 메시지 출력여부
  });

  ResponseToken = async (req, res) => {
    if (req.user) {
      const userId = req.user[0];
      const exUser = req.user[1];
      const accessToken = jwt.sign(
        { key1: userId + parseInt(process.env.SUM) },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "12h" }
      );
      // const refreshToken = jwt.sign(
      //   { key2: userId },
      //   process.env.REFRESH_TOKEN_SECRET,
      //   { expiresIn: "7d" }
      // );

      // const refresh = await Refresh.create({ refresh_token: refreshToken });

      // const refreshId = refresh.dataValues.refresh_id;

      // const randomRefreshId = refreshId + parseInt(process.env.SUM2);

      res.redirect(
        `https://www.habit-rabbit.shop/?accessToken=${accessToken}&exuser=${exUser}`
      ); // &refreshToken=${randomRefreshId}
      return;
    }
    res.redirect("https://www.habit-rabbit.shop/");
  };
}

module.exports = new SocialLogin();
