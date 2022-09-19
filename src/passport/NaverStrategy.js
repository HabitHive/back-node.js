const passport = require("passport");
const Naver = require("passport-naver");
const User = require("../models/user");

const NaverStrategy = Naver.Strategy;

module.exports = () => {
  passport.use(
    new NaverStrategy(
      {
        clientID: process.env.NAVER_ID,
        clientSecret: process.env.NAVER_SECRET,
        callbackURL: "/api/google/callback",
        // session: true,
        // passReqToCallback: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 네이버 플랫폼에서 로그인 했고 & 소셜 로그인 한 경우
          const exUser = await User.findOne({
            where: {
              email: profile._json.email,
              social: true,
              provider: "naver",
            },
            raw: true,
          });
          // 이미 가입된 네이버 프로필이면 성공 덤으로 네이버 닉네임 업데이트
          if (exUser) {
            await User.update(
              { nickname: profile._json.nickname },
              { where: { user_id: exUser.user_id } }
            );
            done(null, exUser.user_id); // 로그인 인증 완료
          } else {
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            await User.create({
              email: profile._json.email,
              nickname: profile._json.nickname,
              interest: "#",
              point: 0,
              social: true,
              provider: "naver",
            });
            // 방금 가입한 유저 찾기
            const newUser = await User.findOne({
              where: {
                email: profile._json.email,
                social: true,
                provider: "google",
              },
              raw: true,
            });
            done(null, newUser.user_id); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
