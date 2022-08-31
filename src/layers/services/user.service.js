import UserRepository from "../repositories/user.repository.js";

class UserService {
  //회원가입              /api/user/signup
  singup = async () => {};

  //로그인                /api/user/login
  login = async () => {};

  //로그 아웃             /api/user/logout
  logout = async () => {};

  //관심사 설정           /api/user/interest
  interest = async () => {};

  //유저정보              /api/user/mypage/info
  myInfo = async (userId) => {
    const user = await UserRepository.findOneUser(userId);
    if (!user) return { status: 400, message: "존재하지 않는 유저입니다." };
    const result = {
      email: user.email,
      nickname: user.nickname,
      point: user.point,
    };

    return { status: 200, message: "유저 정보", result };
  };

  //현재 진행 중 태그     /api/user/mypage/still
  stillTag = async () => {
    const tagList = await TagRepository.findAllTag(userId);
  };

  //완료된 태그           /api/user/mypage/end
  doneTag = async () => {};
}

export default new UserService();
