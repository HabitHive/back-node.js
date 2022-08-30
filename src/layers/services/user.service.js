import UserRepository from "../repositories/user.repository.js";
import bcrypt from "bcrypt";
import Joi from "joi";

class UserService {
  //회원가입              /api/user/signup
  singup = async (body) => {
    const userschema = Joi.object()
      .keys({
        email: Joi.string()
          .pattern(
            new RegExp(
              "^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$"
            )
          )
          .required(),
        password: Joi.string()
          .pattern(
            new RegExp(
              "^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{8,16}$"
            )
          )
          .required(),
        nickname: Joi.string()
          .pattern(new RegExp("(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{1,10}$"))
          .required(),
      })
      .unknown(true);
    await userschema.validateAsync(body);
    const { email, nickname, password } = body;
    const salt = await bcrypt.genSalt(10); // 기본이 10번이고 숫자가 올라갈수록 연산 시간과 보안이 높아진다.
    const hashedpassword = await bcrypt.hash(password, salt); // hashedpassword를 데이터베이스에 저장한다.
    const result = await UserRepository.singup(email, nickname, hashedpassword);
    return result;
  };

  //로그인                /api/user/login
  login = async () => {};

  //로그 아웃             /api/user/logout
  logout = async () => {};

  //관심사 설정           /api/user/interest
  interest = async () => {};

  //유저정보              /api/user/mypage/info
  mp_info = async () => {};

  //현재 진행 중 태그     /api/user/mypage/still
  mp_still = async () => {};

  //완료된 태그           /api/user/mypage/end
  mp_end = async () => {};
}

export default new UserService();
