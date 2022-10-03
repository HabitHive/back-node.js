const passport = require("passport");
const Google = require("passport-google-oauth2");
const User = require("../models/user");

const GoogleStrategy = Google.Strategy;

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: process.env.GOOGLE_URL,
        // passReqToCallback: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 구글 플랫폼에서 로그인 했고 & 소셜 로그인 한 경우
          const exUser = await User.findOne({
            where: {
              email: profile._json.email,
              social: true,
              provider: "google",
            },
            raw: true,
          });
          // 이미 가입된 구글 프로필이면 구글 닉네임 업데이트
          if (exUser) {
            await User.update(
              { nickname: profile._json.name },
              { where: { user_id: exUser.user_id } }
            );
            done(null, [exUser.user_id, true]); // 로그인 인증 완료
          } else {
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            const newUser = await User.create({
              email: profile._json.email,
              nickname: profile._json.name,
              interest: "#",
              point: 0,
              social: true,
              provider: "google",
            });
            done(null, [newUser.dataValues.user_id, false]); // 회원가입하고 로그인 인증 완료
          }
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
