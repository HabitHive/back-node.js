import PetService from "../services/pet.service.js";

export default new (class PetController {
  response = (res, receive) => {
    res
      .status(receive.status)
      .json({ message: receive.message, result: receive.result });
  };

  getPetInfo = async (req, res, next) => {
    const { userId } = res.locals;
    const receive = await PetService.petInfo(userId);
    return this.response(res, receive);
  };

  buyingPetExp = async (req, res, next) => {
    const { userId } = res.locals;
    const receive = await PetService.petExpIncrease(userId);
    return this.response(res, receive);
  };

  getPetList = async (req, res, next) => {};
})();
