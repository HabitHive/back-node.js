import PetRepository from "../repositories/pet.repository.js";

export default class PetService {
  petRepository = new PetRepository();

  err = async (status, message, result) => {
    return { status, message };
  };

  // 유저가 존재하는지 확인
  checkUser = async (userId) => {};

  // 유저가 가진 펫 정보
  petInfo = async (userId, type) => {
    const pet = await this.petRepository.findPet(userId, type);
    if (pet) return { status: 200, message: "정보 불러오기 완료", result: pet }; // 펫이 있는 경우

    // 펫이 없는 경우
    await this.petRepository.createPet(userId);
    const newPet = await this.petRepository.findPet(userId, type);
    return this.err(201, "펫 생성 완료", newPet);
  };

  // 1.1.0 에서 사용 될 기능
  petInfo2 = async (userId, type) => {
    if (type < 1 || 1 < type) return this.err(400, "존재하지 않는 펫입니다.");

    const pet = await this.petRepository.findPet(userId, type);
    return this.err(400, "보유하지 않은 펫입니다.");
  };

  petExpIncrease = async () => {};
}
