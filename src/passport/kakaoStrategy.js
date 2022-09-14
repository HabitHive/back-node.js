import passport from "passport";
import Kakao from "passport-kakao";
import User from "../models/user.js";

const KakaoStrategy = Kakao.Strategy;

export default () => {
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KAKAO_ID, // 카카오 로그인에서 발급받은 REST API 키
        callbackURL: "http://43.200.163.13/api/kakao/callback", // 카카오 로그인 Redirect URI 경로
        // session: true,
        // passReqToCallback: true,
      },
      /*
       * clientID에 카카오 앱 아이디 추가
       * callbackURL: 카카오 로그인 후 카카오가 결과를 전송해줄 URL
       * accessToken, refreshToken: 로그인 성공 후 카카오가 보내준 토큰
       * profile: 카카오가 보내준 유저 정보. profile의 정보를 바탕으로 회원가입
       */
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 카카오 플랫폼에서 로그인 했고 & 소셜 로그인 한 경우
          const exUser = await User.findOne({
            where: {
              email: profile._json.kakao_account.email,
              social: true,
              provider: "kakao",
            },
            raw: true,
          });
          // 이미 가입된 카카오 프로필이면 카카오톡 닉네임 업데이트
          if (exUser) {
            await User.update(
              { nickname: profile._json.kakao_account.profile.nickname },
              { where: { user_id: exUser.user_id } }
            );
            done(null, exUser.user_id); // 로그인 인증 완료
          } else {
            // 가입되지 않는 유저면 회원가입 시키고 로그인을 시킨다
            await User.create({
              email: profile._json.kakao_account.email,
              nickname: profile._json.kakao_account.profile.nickname,
              interest: "#",
              point: 0,
              social: true,
              provider: "kakao",
            });
            const newUser = await User.findOne({
              // 방금 가입한 유저 찾기
              where: {
                email: profile._json.kakao_account.email,
                social: true,
                provider: "kakao",
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
