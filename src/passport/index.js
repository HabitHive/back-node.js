import passport from "passport";
import kakao from "./kakaoStrategy.js";

import User from "../models/user.js";

export default () => {
  kakao(); // 카카오 등록

  passport.serializeUser((user_id, done) => {
    done(null, user_id);
  });

  passport.deserializeUser((id, done) => {
    if (id) return done(null, true);
    done(null, false);
  });
};
