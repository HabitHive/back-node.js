import express from "express";
import dotenv from "dotenv";
import router from "./layers/router/index.js";
import morgan from "morgan";
import chalk from "chalk";
import { sequelize } from "./models/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MySQLStoreCreator from "express-mysql-session";
import mysql from "mysql";
import passport from "passport";
import passportConfig from "./passport/index.js";

dotenv.config();

const app = express();
passportConfig();

app.set("port", process.env.PORT || 3000);

sequelize
  .sync({ force: false })
  .then(() => console.log("db connect"))
  .catch((err) => console.error(err));

const whitelist = [
  "http://localhost:3000",
  "http://habit-rabbit-front.s3-website.ap-northeast-2.amazonaws.com/",
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
app.use(
  cors(
    corsOptions
    // { origin: true, credentials: true }
  )
);

//session store
const options = {
  host: process.env.DEV_DB_HOST,
  port: 3306,
  user: process.env.DEV_DB_ID,
  password: process.env.DEV_DB_PW,
  database: process.env.DEV_DB,
  clearExpired: true, //  만료된 세션 자동 확인 및 지우기 여부
  checkExpirationInterval: 7 * 24 * 60 * 60 * 1000, //  (단위: milliseconds) 1000 = 1 seconds, 만료된 세션이 지워지는 빈도
  expiration: 30 * 24 * 60 * 60 * 1000, //  유효기간 1 month
  createDatabaseTable: false, //  세션 데이터베이스 테이블 생성 여부(아직 존재하지 않는 경우 기본값 true)
};

const MySQLStore = MySQLStoreCreator(session);
const connection = mysql.createConnection(options);
const sessionStore = new MySQLStore({}, connection);

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    cookie: { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 },
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

// 라우터
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

app.listen(app.get("port"), () =>
  console.log(chalk.blueBright(app.get("port")) + " 포트로 열렸습니다")
);
