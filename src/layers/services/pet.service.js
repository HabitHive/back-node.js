import PetRepository from "../repositories/pet.repository.js";
import UserRepository from "../repositories/user.repository.js";

export default new (class PetService {
  response = (status, message, result) => {
    return { status, message, result };
  };

  petInfo = async (userId) => {
    const petInfo = await PetRepository.findOrCreatePet(userId);
    if (petInfo.created)
      return this.response(201, "펫이 생성 되었습니다.", petInfo.pet);
    else return this.response(200, "펫 정보를 불러왔습니다.", petInfo.pet);
  };

  petExpIncrease = async (userId) => {
    const user = await UserRepository.findOneUser(userId);
    if (!user) return this.response(401, "존재하지 않는 유저입니다.");
    else if (user.point < 50)
      return this.response(400, "보유 포인트가 부족합니다.");

    const pet = await PetRepository.findPet(userId);
    if (!pet) return this.response(400, "펫이 존재하지 않습니다.");

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
    if (updatePet == [0]) return this.response(400, "알 수 없는 에러");

    return this.response(201, "펫 경험치 증가 성공", { levelUp });
  };
})();
