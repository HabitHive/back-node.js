import { Op } from "sequelize";
import Pet from "../../models/pet.js";

export default class PetRepository {
  //

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

  findPet = async (userId, type) => {
    const pet = await Pet.findOne({
      where: { [Op.and]: [{ type }, { user_id: userId }] },
      raw: true,
    });

    return pet;
  };
}
