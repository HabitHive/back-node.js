const express = require("express");
const dotenv = require("dotenv");
const router = require("./layers/router");
const social = require("./layers/router/social.login");
const morgan = require("morgan");
const { sequelize } = require("./models");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportConfig = require("./passport/index");

dotenv.config();

const app = express();
passportConfig();

app.set("port", process.env.PORT || 3000);

sequelize
  .sync({ force: false })
  .then(() => console.log("db connect"))
  .catch((err) => console.error(err));

app.get("/", (req, res, next) => {
  res.send("기본페이지~다~~ 이 말이야!");
});

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);

app.use(cookieParser());

//! express-session에 의존하므로 뒤에 위치해야 함
app.use(passport.initialize()); // 요청 객체에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport정보를 추가 저장
// passport.session()이 실행되면, 세션쿠키 정보를 바탕으로 해서 passport/index.js의 deserializeUser()가 실행하게 한다.

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 소셜 로그인 라우터
app.use("/api", social);

const whitelist = [
  "https://localhost:3000",
  "http://localhost:3000",
  "https://habitrabbit.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error("Not Allowed Origin!"));
    }
  },
};

app.use(cors(corsOptions));

// 기존 라우터
app.use("/api", router);

app.use((req, res, next) => {
  const error = new Error(
    `메서드 ${req.method} 경로 ${req.url} 존재하지 않습니다.`
  );
  next(error);
});

app.use((err, req, res, next) => {
  return res.status(404).json({
    success: false,
    message: err.message,
    result: err,
  });
});

module.exports = app;
