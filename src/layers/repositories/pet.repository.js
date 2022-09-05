import Pet from "../../models/pet.js";

class PetRepository {
  findOrCreatePet = async (user_id) => {
    const result = await Pet.findOrCreate({ where: { user_id }, raw: true });
    return result;
  };

  findPet = async (user_id) => {
    const pet = await Pet.findOne({ where: { user_id }, raw: true });
    return pet;
  };

  updatePet = async (user_id, level, exp) => {
    const result = await Pet.update({ level, exp }, { where: { user_id } });
    return result;
  };
}

export default new PetRepository();
