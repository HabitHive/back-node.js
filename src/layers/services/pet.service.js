const PetRepository = require("../repositories/pet.repository");
const UserRepository = require("../repositories/user.repository");

class PetService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  /**
   * 펫 정보 요청
   * @param {number} userId 사용자별 유니크 숫자
   * @returns 펫 정보 level, exp
   */
  petInfo = async (userId) => {
    const pet = await PetRepository.findOrCreatePet(userId);
    if (!pet) return this.result(400, "알 수 없는 에러");
    else if (pet[1])
      return this.result(201, "펫 생성 완료", {
        level: pet[0].level,
        exp: pet[0].exp,
      });
    else
      return this.result(200, "펫 불러오기 완료", {
        level: pet[0].level,
        exp: pet[0].exp,
      });
  };

  /**
   * 펫 경험치 증가 요청
   * @param {number} userId 사용자별 유니크 숫자
   * @returns levelUp: 레벨업 여부 / level / exp
   */
  petExpIncrease = async (userId) => {
    const pet = await PetRepository.findPet(userId);
    const userPoint = await UserRepository.findPoint(userId);
    if (!pet) return this.result(400, "펫이 존재하지 않습니다.");
    else if (userPoint < 50) return this.result(400, "포인트가 부족합니다.");
    const updatePoint = await UserRepository.updatePoint(
      userId,
      userPoint - 50
    );
    if (updatePoint == [0]) return this.result(400, "알 수 없는 에러");

    const history = await UserRepository.createHistory(userId, -50);

    let { level, exp } = pet;
    let levelUp = false;
    const maxExp = 2 ** (level - 1) * 100; // 100 200 400 800
    exp += 50;
    if (exp == maxExp) {
      level++;
      levelUp = true;
      exp = 0;
    }

    const updatePet = await PetRepository.updatePet(userId, level, exp);
    if (updatePet == [0]) return this.result(400, "알 수 없는 에러");

    return this.result(201, "펫 경험치 증가 성공", { levelUp, level, exp });
  };
}

module.exports = new PetService();
