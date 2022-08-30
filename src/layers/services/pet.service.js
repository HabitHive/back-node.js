import PetRepository from "../repositories/pet.repository.js";

export default class PetService {
  petRepository = new PetRepository();

  result = async (status, message, result) => {
    return { status, message, result };
  };

  // 유저가 가진 펫 정보
  petInfo = async (userId, type) => {
    // Count of type : 1
    // 추후 펫 종류 추가시 조건 변경할 것
    if (type < 1 || 1 < type)
      return this.result(400, "존재하지 않는 펫입니다.");

    const pet = await this.petRepository.findPet(userId, type);
    if (pet) return this.result(200, "정보 불러오기 완료", pet);
    else if (type === 1) {
      await this.petRepository.createPet(userId);
      const newPet = await this.petRepository.findPet(userId, type);
      return this.result(201, "펫 생성 완료", newPet);
    }

    return this.result(400, "보유하지 않은 펫입니다.");
  };

  petExpIncrease = async () => {};
}
