const dotenv = require("dotenv");

dotenv.config({ path: "../.env" }); //src 폴더가있는 동일선상의 파일 경로에 .env파일을 생성해주셔야 합니다

const development = {
  username: process.env.DEV_DB_ID,
  password: process.env.DEV_DB_PW,
  database: process.env.DEV_DB,
  host: process.env.DEV_DB_HOST,
  dialect: "mysql",
  logging: false,
  timezone: "+00:00",
  dialectOptions: { dateStrings: true, typeCast: true },
  define: { timestamps: true },
};

const test = {
  username: process.env.TEST_DB_ID,
  password: process.env.TEST_DB_PW,
  database: process.env.TEST_DB,
  host: process.env.TEST_DB_HOST,
  dialect: "mysql",
  logging: false,
  timezone: "+00:00",
  dialectOptions: { dateStrings: true, typeCast: true },
  define: { timestamps: true },
};

const production = {
  username: process.env.PRO_DB_ID,
  password: process.env.PRO_DB_PW,
  database: process.env.PRO_DB,
  host: process.env.PRO_DB_HOST,
  dialect: "mysql",
  logging: false,
  timezone: "+00:00",
  dialectOptions: { dateStrings: true, typeCast: true },
  define: { timestamps: true },
};

module.exports = { development, test, production };
