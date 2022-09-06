import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

class SocialLogin {
  //* 카카오로 로그인하기 라우터 ***********************
  //? /kakao로 요청오면, 카카오 로그인 페이지로 가게 되고, 카카오 서버를 통해 카카오 로그인을 하게 되면, 다음 라우터로 요청한다.
  // router.get("/kakao", passport.authenticate("kakao"));
  Kakao = passport.authenticate("kakao");

  //? 위에서 카카오 서버 로그인이 되면, 카카오 redirect url 설정에 따라 이쪽 라우터로 오게 된다.
  // router.get("/kakao/callback", passport.authenticate("kakao",{option}));

  //? 그리고 passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
  KakaoCallBack = passport.authenticate("kakao", {
    // successRedirect: "/", // kakaoStrategy에서 성공한다면 실행
    failureRedirect: "/api/kakao", // kakaoStrategy에서 실패한다면 실행
    // successFlash: "성공적", // 성공시 플래시 메시지 출력
    // failureFlash: true, //실패시 플래시 메시지 출력여부
  });
  // kakaoStrategy에서 성공한다면 콜백 실행
  ResponseToken = (req, res) => {
    try {
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
        req.session.save((err) => {
          if (err) {
            console.log(err);
            const error = new Error("session save error");
            error.name = "can not create session";
            error.status = 500;
            throw error;
          }
        });
        res.status(201).json({ token: accessToken });
        return;
      }
      const error = new Error("social session not exist");
      error.name = "social login error";
      error.status = 500;
      throw error;
    } catch (error) {
      if (error.status) {
        console.log(error);
        res.status(error.status).json({ message: error.name });
        return;
      }
      console.log(error);
      res.status(400).json({ message: error.name });
    }
  };
}

export default new SocialLogin();
