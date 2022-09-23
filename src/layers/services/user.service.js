const UserRepository = require("../repositories/user.repository");
const TagRepository = require("../repositories/tag.repository");
const PetRepository = require("../repositories/pet.repository");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

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
      const refreshToken = jwt.sign(
        { key2: user.user_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      console.log(refreshToken);
      const refreshId = await UserRepository.refresh(refreshToken);

      return {
        accessToken: accessToken,
        refreshToken: refreshId + parseInt(process.env.SUM2),
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
    const today = new Date(
      [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-") +
        " 09:00:00"
    );

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
          const dDay =
            (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);

          if (dDay > tag.period) {
            stillTags.push({
              tagName: tag["Tag.tag_name"],
              dDay: tag.period,
              week,
            });
          } else {
            stillTags.push({ tagName: tag["Tag.tag_name"], dDay, week });
          }
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
}

module.exports = new UserService();
