const app = require("./app");
const chalk = require("chalk");

app.listen(app.get("port"), () =>
  console.log(chalk.blueBright(app.get("port")) + " 포트로 열렸습니다")
);
