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
import * as mysql2 from "mysql2/promise";
import passport from "passport";
import passportConfig from "./passport/index.js";
import flash from "connect-flash";

dotenv.config();

const app = express();
passportConfig();

app.set("port", process.env.PORT || 3000);

sequelize
  .sync({ force: false })
  .then(() => console.log("db connect"))
  .catch((err) => console.error(err));

app.use(
  cors({
    origin: process.env.CLIENT_HOST,
    credentials: process.env.ENABLE_CORS,
  })
);

app.use(cookieParser());

//session store
const options = {
  host: process.env.DEV_DB_HOST,
  port: process.env.RDS_PORT,
  user: process.env.DEV_DB_ID,
  password: process.env.DEV_DB_PW,
  database: process.env.DEV_DB,
};

const MySQLStore = MySQLStoreCreator(session);
const connection = mysql2.createPool(options);
const sessionStore = new MySQLStore({}, connection);

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    key: process.env.SESSION_KEY,
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

app.use(flash()); // passport 사용 시 1회성으로 명시적 메시지 출력

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
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  return res.json({
    success: false,
    message: err.message,
    result: err,
  });
});

app.listen(app.get("port"), () =>
  console.log(chalk.blueBright(app.get("port")) + " 포트로 열렸습니다")
);
