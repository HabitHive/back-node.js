const PetService = require("../services/pet.service");

class PetController {
  response = (res, receive) => {
    res
      .status(receive.status)
      .json({ message: receive.message, result: receive.result });
  };

  getPetInfo = async (req, res) => {
    const { userId } = res.locals;
    const receive = await PetService.petInfo(userId);
    return this.response(res, receive);
  };

  buyingPetExp = async (req, res) => {
    const { userId } = res.locals;
    const receive = await PetService.petExpIncrease(userId);
    return this.response(res, receive);
  };

  getPetList = async (req, res, next) => {};
}

module.exports = new PetController();
