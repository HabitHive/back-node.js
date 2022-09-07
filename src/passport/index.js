import passport from "passport";
import kakao from "./kakaoStrategy.js";
import google from "./GoogleStrategy.js";

export default () => {
  kakao(); // 카카오 등록
  google(); // 구글 등록

  passport.serializeUser((user_id, done) => {
    done(null, user_id);
  });

  passport.deserializeUser((id, done) => {
    if (id) return done(null, true);
    done(null, false);
  });
};
