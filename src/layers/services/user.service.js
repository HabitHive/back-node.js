const UserRepository = require("../repositories/user.repository");
const TagRepository = require("../repositories/tag.repository");
const PetRepository = require("../repositories/pet.repository");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

dotenv.config();

const userSchema = Joi.object()
  .keys({
    email: Joi.string()
      .pattern(
        // /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
        new RegExp(
          /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/
        )
      )
      .required(),
    password: Joi.string()
      .pattern(
        // /^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,16}$/
        new RegExp(
          /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,16}$/
        )
      )
      .required(),
    nickname: Joi.string()
      .pattern(
        // /(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{1,10}$/
        new RegExp(/^(?=.*[A-Za-z0-9가-힣])[A-Za-z0-9가-힣]{1,10}$/)
      )
      .required(),
  })
  .unknown(true);

class UserService {
  //회원가입              /api/user/signup
  singUp = async (body) => {
    await userSchema.validateAsync(body);
    const { email, nickname, password } = body;
    const salt = await bcrypt.genSalt(10); // 기본이 10번이고 숫자가 올라갈수록 연산 시간과 보안이 높아진다.
    const hashedpassword = await bcrypt.hash(password, salt); // hashedpassword를 데이터베이스에 저장한다.
    const repositoryResult = await UserRepository.singUp(
      email,
      nickname,
      hashedpassword
    );

    if (repositoryResult) {
      const error = new Error("already exsist email");
      error.name = "Account error";
      error.status = 403;
      throw error;
    } else {
      await UserRepository.createAccount(email, nickname, hashedpassword);
      return 1;
    }
  };

  //로그인                /api/user/login
  logIn = async (email, password, req) => {
    const user = await UserRepository.logIn(email);
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        const error = new Error("wrong password");
        error.name = "Account error";
        error.status = 403;
        throw error;
      }

      const accessToken = jwt.sign(
        { key1: user.user_id + parseInt(process.env.SUM) },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "12h" }
      );
      // const refreshToken = jwt.sign(
      //   { key2: user.user_id },
      //   process.env.REFRESH_TOKEN_SECRET,
      //   { expiresIn: "7d" }
      // );
      // const refreshId = await UserRepository.refresh(refreshToken);

      return {
        accessToken: accessToken,
        // refreshToken: refreshId + parseInt(process.env.SUM2),
      };
    } else {
      const error = new Error("not exist User");
      error.name = "Account error";
      error.status = 403;
      throw error;
    }
  };

  //로그 아웃             /api/user/logout
  logOut = async (req) => {
    const { refresh } = req.headers;
    const refreshId = parseInt(refresh) - parseInt(process.env.SUM2);
    const result = await UserRepository.logOut(refreshId);
    if (result) {
      const error = new Error("not exist logindata");
      error.name = "Login error";
      error.status = 403;
      throw error;
    }
  };

  //관심사 설정           /api/user/interest
  interest = async (body, user_id) => {
    body.sort();
    body.unshift("");
    body.push("");
    const interest = body.join("#");
    await UserRepository.interest(interest, user_id);
  };

  result = async (status, message, result) => {
    return { status, message, result };
  };

  /**
   * 유저 정보
   * @param {number} userId 사용자별 유니크 숫자
   * @returns email / nickname / point
   */
  myInfo = async (userId) => {
    const user = await UserRepository.findUser(userId);
    if (!user) return this.result(400, "존재하지 않는 유저입니다.");

    const pet = await PetRepository.findPet(userId);

    const result = {
      email: user.email,
      nickname: user.nickname,
      point: user.point,
      petLevel: pet?.level,
    };

    return this.result(200, "유저 정보", result);
  };

  /**
   * 유저의 습관 정보 불러오기
   * @param {number} userId 사용자별 유니크 숫자
   * @param {string} today 오늘 날짜
   * @returns stillTags: 종료되지 않은 습관 / successTags: 완주 성공 / failTags: 완주 실패
   */
  myTag = async (userId) => {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    const krDiff = 9 * 60 * 60 * 1000;
    const today = new Date(utc + krDiff);
    today.setHours(0, 0, 0, 0);

    const tagLists = await TagRepository.myAllTagList(userId);
    if (tagLists.length == 0) {
      return this.result(200, "습관 기록이 없습니다.", {
        stillTags: [],
        successTags: [],
        failTags: [],
      });
    }

    let stillTags = [];
    let successTags = [];
    let failTags = [];

    for (let i in tagLists) {
      const tag = tagLists[i];
      if (tag.success === 1) {
        // 성공 습관
        successTags.push(tag["Tag.tag_name"]);
      } else if (tag.success === 0) {
        // 실패 습관
        failTags.push(tag["Tag.tag_name"]);
        // await TagRepository.isNull(tag.user_tag_id);
      } else if (tag.end_date === null) {
        // 예약되지 않은 습관
        stillTags.push({
          tagName: tag["Tag.tag_name"],
          dDay: tag.period,
          week: [false, false, false, false, false, false, false],
          color: tag["Tag.color"],
        });
      } else {
        const endDate = new Date(tag.end_date);
        if (endDate >= today) {
          // 진행 중이거나 진행 될 예정인 습관

          /* 일정에 해당 요일이 지정된 적 있는지의 여부*/
          let week = [false, false, false, false, false, false, false];

          const scheduleList = await TagRepository.schedule(tag.user_tag_id);
          scheduleList.map((schedule) => {
            const numWeek = schedule.week_cycle.split(",");
            numWeek.map((w) => {
              week[w] = true;
            });
          });

          /* 종료까지 남은 기간 == d-Day */
          let dDay = (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
          if (dDay > tag.period) dDay = tag.period;

          stillTags.push({
            tagName: tag["Tag.tag_name"],
            dDay,
            week,
            color: tag["Tag.color"],
          });
        } else {
          // 종료 된 습관
          const count = await UserRepository.countHistory(tag.user_tag_id);
          const boolean = count == tag.period;
          const updateTag = await TagRepository.isSuccess(
            tag.user_tag_id,
            boolean
          );
          if (updateTag == [0]) return this.result(400, "알 수 없는 에러");
          if (boolean == true) {
            successTags.push(tag["Tag.tag_name"]);
          } else {
            failTags.push(tag["Tag.tag_name"]);
          }
        }
      }
    }

    return this.result(200, "마이 태그", { stillTags, successTags, failTags });
  };

  randomPoint = async (userId) => {
    const userPoint = await UserRepository.findPoint(userId);

    // const now = new Date();
    // const utc = now.getTime() + now.getTimezoneOffset() * 60 * 1000;
    // const krDiff = 9 * 60 * 60 * 1000;
    // const today = new Date(utc + krDiff);
    // today.setHours(0, 0, 0, 0);

    // const chance = 5;
    // const existHistory = await UserRepository.existRandomHistory(userId, today);
    // if (existHistory > chance) return this.result(403, "수령 가능 횟수 초과");

    let random = Math.floor(Math.random() * 100 + 1); // 1~100
    const percentage = (num, count) => {
      if (num > 100) return 50 * count;
      else if (num < 6) return 250;
      else return percentage(num * 2, count + 1);
    };

    const point = percentage(random, 0);
    const updatePoint = await UserRepository.updatePoint(
      userId,
      userPoint + point
    );
    if (updatePoint == [0]) return this.result(400, "알 수 없는 에러");
    // const createHistory = await UserRepository.createRandomHistory(userId, today, point);

    return this.result(201, "랜덤 포인트", { point });
  };

  findPassWord1 = async (email) => {
    const findUser = await UserRepository.findPassWord1(email);
    if (!findUser) {
      const error = new Error("not exist User");
      error.name = "Account error";
      error.status = 403;
      throw error;
    }
    const randomString = new Date().getTime().toString(36);

    await UserRepository.updateVerify(email, randomString);

    const mailConfig = {
      service: "Naver",
      host: "smtp.naver.com",

      port: 587,
      auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
      },
    };
    let message = {
      from: `"해빗 래빗" <${process.env.MAIL_EMAIL}>`,
      to: email,
      subject: "비밀번호 변경 인증 요청 코드입니다.",
      html: `<p>인증 요청 코드: ${randomString}</p>`,
    };
    let transporter = nodemailer.createTransport(mailConfig);
    transporter.sendMail(message, function (error, info) {
      if (error) {
        throw error;
      }
    });
  };

  findPassWord2 = async (verify) => {
    const result = await UserRepository.findVerify(verify);
    const { email } = result;
    if (result) {
      const temporaryPW = `PW@${Math.random().toString(36).substring(2, 8)}`;
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(temporaryPW, salt);
      await UserRepository.temporaryPW(verify, hashedpassword);

      const mailConfig = {
        service: "Naver",
        host: "smtp.naver.com",

        port: 587,
        auth: {
          user: process.env.MAIL_EMAIL,
          pass: process.env.MAIL_PASSWORD,
        },
      };
      let message = {
        from: `"해빗 래빗" <${process.env.MAIL_EMAIL}>`,
        to: email,
        subject: "임시 비밀번호입니다.",
        html: `<p>임시 비밀번호: ${temporaryPW}</p>`,
      };
      let transporter = nodemailer.createTransport(mailConfig);
      transporter.sendMail(message, function (error, info) {
        if (error) {
          throw error;
        }
      });
    } else {
      const error = new Error("not exist Verify-code");
      error.name = "Verify error";
      error.status = 403;
      throw error;
    }
  };

  changePassWord = async (userId, password) => {
    const user = await UserRepository.findUser(userId);
    if (user) {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);
      await UserRepository.changePassWord(userId, hashedpassword);
    } else {
      const error = new Error("not exist User");
      error.name = "Account error";
      error.status = 403;
      throw error;
    }
  };

  signOut = async (userId) => {
    const user = await UserRepository.findUser(userId);
    if (!user) {
      const error = new Error("not exist User");
      error.name = "Account error";
      error.status = 403;
      throw error;
    }
    await UserRepository.signOut(userId);
  };
}

module.exports = new UserService();
