const passport = require("passport");
const kakao = require("./kakaoStrategy");
const google = require("./GoogleStrategy");
const naver = require("./NaverStrategy");

module.exports = () => {
  kakao(); // 카카오 등록
  google(); // 구글 등록
  naver(); // 네이버 등록

  passport.serializeUser((user, done) => {
    done(null, user[0]);
  });

  passport.deserializeUser((id, done) => {
    if (id) return done(null, true);
    done(null, false);
  });
};
