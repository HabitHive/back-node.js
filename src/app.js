import express from "express";
import dotenv from "dotenv";
import router from "./layers/routers/index.js";
import morgan from "morgan";
import chalk from "chalk";
import { sequelize } from "./models/index.js";

dotenv.config();

const app = express();

app.set("port", process.env.PORT || 3000);

sequelize
  .sync({ force: false })
  .then(() => console.log("db connect"))
  .catch((err) => console.error(err));

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
