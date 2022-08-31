import { Op, where } from "sequelize";
import Pet from "../../models/pet.js";

export default new (class PetRepository {
  findPet = async (userId) => {
    const pet = await Pet.findOne({ where: { user_id: userId } });

    return pet;
  };
  findOrCreatePet = async (userId) => {
    const [pet, created] = await Pet.findOrCreate({
      where: { user_id: userId },
      defaults: { type: 1, level: 1, exp: 0 },
    });

    return { pet, created };
  };

  updatePet = async (userId, level, exp) => {
    const pet = await Pet.update(
      { level, exp },
      { where: { user_id: userId } }
    );

    return pet;
  };
})();
