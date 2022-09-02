import PetRepository from "../repositories/pet.repository.js";
import UserRepository from "../repositories/user.repository.js";

class PetService {
  result = async (status, message, result) => {
    return { status, message, result };
  };

  // 유저가 가진 펫 정보
  petInfo = async (userId, type) => {
    const pet = await PetRepository.findOrCreatePet(userId);
    if (!pet) return this.result(400, "존재하지 않는 유저입니다.");
    else if (pet.created) return this.result(201, "펫 생성 완료", pet.info);
    else return this.result(200, "펫 불러오기 완료", pet.info);
  };

  petExpIncrease = async (userId) => {
    const userPoint = await UserRepository.findPoint(userId);
    if (!userPoint) return this.result(400, "존재하지 않는 유저입니다.");
    else if (userPoint < 50) return this.result(400, "포인트가 부족합니다.");

    const pet = await PetRepository.findPet(userId);
    if (!pet) return this.result(400, "펫이 존재하지 않습니다.");

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

    return this.result(201, "펫 경험치 증가 성공", { levelUp });
  };
}

export default new PetService();
