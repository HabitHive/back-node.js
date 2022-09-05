import Pet from "../../models/pet.js";

class PetRepository {
  /**
   * 펫 정보 요청
   * @param {number} user_id 사용자별 유니크 숫자
   * @returns result[0] 펫 정보, result[1] 펫 생성 Boolean
   */
  findOrCreatePet = async (user_id) => {
    const result = await Pet.findOrCreate({ where: { user_id }, raw: true });
    return result;
  };

  /**
   * 펫 정보 요청 (펫 생성 X)
   * @param {number} user_id 사용자별 유니크 숫자
   * @returns 단일 pet 정보 반환
   */
  findPet = async (user_id) => {
    const pet = await Pet.findOne({ where: { user_id }, raw: true });
    return pet;
  };

  /**
   * 펫 경험치와 레벨 변경사항 저장
   * @param {number} user_id 사용자별 유니크 숫자
   * @param {number} level
   * @param {number} exp
   * @returns
   */
  updatePet = async (user_id, level, exp) => {
    const result = await Pet.update({ level, exp }, { where: { user_id } });
    return result;
  };
}

export default new PetRepository();
