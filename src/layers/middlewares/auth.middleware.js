import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../../models/user.js";
dotenv.config();

export default async (req, res, next) => {
  let { authorization } = req.headers; //header 안쪽 authorization(구조분해 할당)라는 key값으로 엑세스 토큰 받아오기
  let refreshtoken = req.session.a1; //리프레쉬 토큰 값 불러오기

  try {
    //엑세스 토큰 존재 유무 확인
    if (authorization === undefined) {
      throw new Error("not exist header");
    }

    //authorization 파일 양식 확인
    const [tokenType, tokenValue] = (authorization || "").split(" ");

    if (tokenType !== "Bearer") {
      throw new Error("not exist token");
    }

    //리프레쉬 토큰 존재 유무 확인
    if (refreshtoken === undefined) {
      throw new Error("not exist token");
    }

    //엑세스 토큰 유효성 검사
    const access_token_verify = jwt.verify(
      tokenValue,
      process.env.ACCESS_TOKEN_SECRET,
      (err, decoded) => {
        //에러날시 아래 코드 작동
        if (err) {
          //엑세스 토큰의 유효기간 만기시 재발급 과정 진행
          if (err.name === "TokenExpiredError") {
            const refresh_token_verify = jwt.verify(
              refreshtoken,
              process.env.REFRESH_TOKEN_SECRET,
              (err, decoded) => {
                if (err) {
                  //유효성 검사에서 불합격시 "invalid signature" 에러 반환 처리
                  throw new Error("invalid signature");
                } else {
                  //유효성 검사 통과시 리프레쉬 디코드 값 반환
                  return decoded;
                }
              }
            );

            //로그인시 생성된 엑세스 토큰 값, 현재 헤더 내 토큰 값
            const proven_access_tokenValue = refresh_token_verify.key2;
            const [tokenType, now_access_tokenValue] = (
              authorization || ""
            ).split(" ");

            //로그인시 생성된 엑세스 토큰 값과 헤더 내 엑세스 토큰 값 비교

            //같을 시
            if (proven_access_tokenValue === now_access_tokenValue) {
              const new_access_token = jwt.sign(
                { key1: refresh_token_verify.key3 + parseInt(process.env.SUM) },
                process.env.ACCESS_TOKEN_SECRET,
                {
                  expiresIn: "1h",
                }
              );
              const new_refresh_token = jwt.sign(
                {
                  key2: new_access_token,
                  key3: refresh_token_verify.key3,
                },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "7d" }
              );
              req.headers.authorization = `Bearer ${new_access_token}`;
              req.session.a1 = new_refresh_token;
              req.session.save();
              console.log(req.headers.authorization);
              console.log(req.session.a1);

              const decoded_value = jwt.decode(now_access_tokenValue);
              return decoded_value;
            }
            //다를 시
            else {
              throw new Error("invalid signature");
            }
          }
          //엑세스 토큰의 유효성 검사 불합격시 "invalid signature"이름으로 예외처리
          if (err.name === "JsonWebTokenError") {
            throw new Error("invalid signature");
          }
          //그 이외의 에러시 에러 반환 처리
          throw new Error(err);
        }
        //검사 통과시 디코드 값 반환
        else {
          return decoded;
        }
      }
    );

    //반환된 엑세스 토큰내 유저 아이디 검색
    const find_user = await User.findOne({
      where: { user_id: access_token_verify.key1 - parseInt(process.env.SUM) },
    });

    //유저아이디 존재하지 않을시 에러 반환 처리
    if (find_user === null) {
      throw new Error("invalid signature");
    }

    //유저 존재 확인 후 반환된 엑세스 토큰내 유저 아이디 로컬에 저장
    res.locals.user_id = access_token_verify.key1 - parseInt(process.env.SUM);

    //여기까지 왔다면 모든 검증 완료 이대로 next()로 다음 단계로 넘어감
    next();
  } catch (error) {
    //에러 메시지가 "invalid signature"인 경우 헤더 및 세션 초기화
    if (error.message === "invalid signature") {
      req.headers.authorization = undefined;
      req.session.destroy();
    }
    //콘솔창에 에러 내용 출력 및 res로 "로그인이 필요합니다" 문자열 송신
    console.log(error);
    res.status(400).send("로그인이 필요합니다");
  }
};
