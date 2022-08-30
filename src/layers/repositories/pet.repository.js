import { Op } from "sequelize";
import Pet from "../../models/pet.js";

export default class PetRepository {
  /**
   * 유저 아이디를 받아 펫을 생성한다.
   * @param {number} userId 숫자형의 아이디
   * @returns 생성된 펫의 정보를 반환
   */
  createPet = async (userId) => {
    const pet = await Pet.create({
      user_id: userId,
      type: 1,
      pet_name: "",
      level: 1,
      exp: 0,
    });

    return pet;
  };

  /**
   * 펫을 구입한 경우 새로운 펫 정보를 생성한다.
   * @param {number} userId 숫자형의 아이디
   * @param {number} type 펫의 종류 번호
   * @param {string} petName 설정된 펫의 이름
   * @returns 생성된 펫의 정보를 반환
   */
  createPet2 = async (userId, type, petName) => {
    const pet = await Pet.create({
      user_id: userId,
      type,
      pet_name: petName,
      level: 1,
      exp: 0,
    });
    return pet;
  };

  findPet = async (userId, type) => {
    const pet = await Pet.findOne({
      where: { [Op.and]: [{ type }, { user_id: userId }] },
      raw: true,
    });

    return pet;
  };
}
