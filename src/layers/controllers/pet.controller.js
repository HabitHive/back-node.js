import PetService from "../services/pet.service.js";

export default class PetController {
  petService = new PetService();

  // GET 펫 정보
  // 돌려줄 것 : 펫의... 이름 / 레벨 / 경험치
  getPetInfo = async (req, res, next) => {
    // const { userId } = res.locals;
    const userId = 1;
    const type = 1;

    res.locals.response = await this.petService.petInfo(userId, type);
    console.log(res.locals);
    return next();
  };

  // 1.1.0 에서 사용 될 기능
  // 보유 펫 리스트 정보
  getPetList = async (req, res, next) => {
    // const { userId } = res.locals;
    const userId = 1;

    res.locals.response = await this.petService;
    return next();
  };

  // POST 펫 경험치 증가
  // 필요한 것 : 유저의... 펫 ID / 포인트 잔액
  //            펫의... 현재 경험치 량
  buyingPetExp = async (req, res, next) => {
    // const { userId } = res.locals;
    const type = 1;
  };
}
