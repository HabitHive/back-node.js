import UserRepository from "../repositories/user.repository.js";
import TagRepository from "../repositories/tag.repository.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

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
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,16}$/
        )
      )
      .required(),
    nickname: Joi.string()
      .pattern(
        // /(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{1,10}$/
        new RegExp(/(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{1,10}$/)
      )
      .required(),
  })
  .unknown(true);

class UserService {
  result = async (status, message, result) => {
    return { status, message, result };
  };
  //회원가입              /api/user/signup
  singUp = async (body) => {
    await userSchema.validateAsync(body);
    const { email, nickname, password } = body;
    const salt = await bcrypt.genSalt(10); // 기본이 10번이고 숫자가 올라갈수록 연산 시간과 보안이 높아진다.
    const hashedpassword = await bcrypt.hash(password, salt); // hashedpassword를 데이터베이스에 저장한다.
    const repository_result = await UserRepository.singUp(
      email,
      nickname,
      hashedpassword
    );
    if (repository_result) return true;
  };

  //로그인                /api/user/login
  logIn = async (email, password, req) => {
    const user = await UserRepository.logIn(email);
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error("Mismatched password");
      }
      const accesstoken = jwt.sign(
        { key1: user.user_id + parseInt(process.env.SUM) },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "1h",
        }
      );
      const refreshtoken = jwt.sign(
        {
          key2: accesstoken,
          key3: user.user_id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      req.session.a1 = refreshtoken;
      req.session.save((err) => {
        if (err) {
          console.log(err);
          throw new Error("session save error");
        }
      });
      return accesstoken;
    } else {
      throw new Error("not exist User");
    }
  };

  //로그 아웃             /api/user/logout
  logOut = async (req) => {
    if (req.session.a1)
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          throw new Error("session dstroy error");
        }
      });
    else throw new Error("not exist session");
  };

  //관심사 설정           /api/user/interest
  interest = async (body, user_id) => {
    body.sort();
    body.unshift("");
    body.push("");
    const interest = body.join("#");
    await UserRepository.interest(interest, user_id);
  };

  //유저정보              /api/user/mypage/info
  myInfo = async (userId) => {
    const user = await UserRepository.findUser(userId);
    if (!user) return this.result(400, "존재하지 않는 유저입니다.");

    const result = {
      email: user.email,
      nickname: user.nickname,
      point: user.point,
    };

    return this.result(200, "유저 정보", result);
  };

  //내 태그 리스트
  myTag = async (userId, today) => {
    const tagLists = await TagRepository.myAllTagList(userId);
    if (tagLists == [])
      return this.result(200, "습관 기록이 없습니다.", {
        stillTags: [],
        successTags: [],
        failTags: [],
      });

    let stillTags = [];
    let successTags = [];
    let failTags = [];

    // 수정 중... 날짜 어떤 형식인지 알아야 하는데...?
    for (let tag in tagLists) {
      if (tag.success === true) {
        // 성공 습관
        successTags.push(tag.Tag["tag_name"]);
      } else if (tag.success === false) {
        // 실패 습관
        failTags.push(tag.Tag["tag_name"]);
      } else if (tag.end_date === null) {
        // 시작 전 습관
        stillTags.push({
          tagName: tag.Tag["tag_name"],
          dDay: tag.period,
          week: [false, false, false, false, false, false, false],
        });
      } else {
        const startDate = new Date(tag.start_date);
        const endDate = new Date(tag.end_date);
        if (endDate >= today) {
          // 진행 중인 습관
          let week = [false, false, false, false, false, false, false];
          const scheduleList = await TagRepository.schedule(tag.user_tag_id);
          for (let schedule in scheduleList) {
            const numWeek = schedule.week_cycle.split(",");
            for (let w in numWeek) {
              week[w] = true;
            }
          }
          const dDay =
            (endDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
          if (dDay > tag.period) {
            stillTags.push({
              tagName: tag.Tag["tag_name"],
              dDay: tag.period,
              week,
            });
          } else {
            stillTags.push({ tagName: tag.Tag["tag_name"], dDay, week });
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
          if (boolean) {
            successTags.push(tag.Tag["tag_name"]);
          } else {
            failTags.push(tag.Tag["tag_name"]);
          }
        }
      }
    }

    return this.result(200, "마이 태그", { stillTags, successTags, failTags });
  };
}

export default new UserService();
