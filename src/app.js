import express from "express";
import dotenv from "dotenv";
import router from "./layers/routers/index.js";
import morgan from "morgan";
import chalk from "chalk";
import { sequelize } from "./models/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MySQLStoreCreator from "express-mysql-session";
import * as mysql2 from "mysql2/promise";

dotenv.config();

const app = express();

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
  port: 3306,
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
    key: "user",
    secret: "secret",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

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
