import passport from "passport";
import GoogleStrategy from "passport-google-oauth2";
import User from "../models/user.js";

const GoogleLogin = GoogleStrategy.Strategy;

export default () => {
  passport.use(
    new GoogleLogin(
      {
        clientID: process.env.GOOGLE_ID,
        clientSecret: process.env.GOOGLE_SECRET,
        callbackURL: "/api/google/callback",
        // session: true,
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
          // 이미 가입된 구글 프로필이면 성공 덤으로 구글 닉네임 업데이트
          if (exUser) {
            await User.update(
              { nickname: profile._json.kakao_account.profile.nickname },
              { where: { user_id: exUser.user_id } }
            );
            done(null, exUser.user_id); // 로그인 인증 완료
          } else {
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            await User.create({
              email: profile._json.email,
              nickname: profile._json.name,
              interest: "#",
              point: 0,
              social: true,
              provider: "google",
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
          console.error(error);
          done(error);
        }
      }
    )
  );
};
