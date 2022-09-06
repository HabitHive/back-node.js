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
          /^(?=.*[A-Za-z])(?=.*[0-9])(?=.*[@$!%*#?&])[A-Za-z0-9@$!%*#?&]{8,16}$/
        )
      )
      .required(),
    nickname: Joi.string()
      .pattern(
        // /(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{1,10}$/
        new RegExp(/(?=.*[A-Za-z0-9가-힣])[A-Za-z0-9가-힣]{1,10}$/)
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
        const error = new Error("Mismatched password");
        error.name = "wrong password";
        error.status = 403;
        throw error;
      }
      const accesstoken = jwt.sign(
        { key1: user.user_id + parseInt(process.env.SUM) },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );
      const refreshtoken = jwt.sign(
        { key2: accesstoken, key3: user.user_id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      req.session.a1 = refreshtoken;
      req.session.save((err) => {
        if (err) {
          console.log(err);
          const error = new Error("session save error");
          error.name = "can not create session";
          error.status = 500;
          throw error;
        }
      });
      return accesstoken;
    } else {
      const error = new Error("not exist User");
      error.name = "user not found";
      error.status = 403;
      throw error;
    }
  };

  //로그 아웃             /api/user/logout
  logOut = async (req) => {
    req.logOut();
    if (req.session.a1)
      req.session.destroy((err) => {
        if (err) {
          console.log(err);
          const error = new Error("session destroy error");
          error.name = "can not delete session";
          error.status = 500;
          throw error;
        }
      });
    else {
      const error = new Error("not exist session");
      error.name = "session not found";
      error.status = 500;
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
    console.log(tagLists);
    let stillTags = [];
    let doneList = [];
    let doneTags = { success: [], fail: [] };

    if (tagLists == [])
      return this.result(200, "습관 기록이 없습니다.", { stillTags, doneTags });

    // 수정 중... 날짜 어떤 형식인지 알아야 하는데...?
    for (let tag in tagLists) {
      if (tag.success === true) {
        doneTags.success.push(tag);
      } else if (tag.success === false) {
        doneTags.fail.push(tag);
      } else {
        // null
        if (tag.end_date.getDate() > today) {
          stillTags.push(tag);
        } else {
          doneList.push(tag);
        }
      }
    }

    for (let tag in stillTags) {
      let week = [false, false, false, false, false, false, false];
      const scheduleList = await TagRepository.schedule(tag.user_tag_id);
      for (let schedule in scheduleList) {
        const strWeek = schedule.week_cycle;
        const numWeek = strWeek.split("뭐로 자르지?");
        for (let w in numWeek) {
          week[w] = true;
        }
      }
      stillTags[tag].week_cycle = week;

      // const start = tag.start_date.getDate();
      // const period = tag.period;
      // if (start <= today) {
      //   stillTags[tag].d_day = start - today + period;
      // }
    }

    let success = [];
    let fail = [];

    for (let tag in doneList) {
      // count method 사용해서 수정하기
      const count = await UserRepository.countHistory(tag.user_tag_id);
      const boolean = count == tag.period;
      const updateTag = await TagRepository.isSuccess(tag.user_tag_id, boolean);
      if (updateTag == [0]) return this.result(400, "알 수 없는 에러");
      if (boolean) {
        success.push(tag);
      } else {
        fail.push(tag);
      }
    }

    return this.result(200, "태그 리스트 정리 완료", {
      stillTags,
      successTags: success.concat(doneTags.success),
      failTags: fail.concat(doneTags.fail),
    });
  };
}

export default new UserService();
