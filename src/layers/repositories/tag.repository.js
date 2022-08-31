import UserTag from "../../models/usertag.js";
import Tag from "../../models/tag.js";

export default new (class TagRepository {
  findOneUserTag = async () => {
    const tag = await UserTag.findOne({ where: {} });
    return;
  };
  findOneDoneTag = async () => {
    const tag = await Tag.findOne({ where: {} });
    return;
  };
  findAllUserTag = async () => {
    const tag = await UserTag.findAll({ where: {} });
    return;
  };
  findAllDoneTag = async () => {
    const tag = await Tag.findAll({ where: {} });
    return;
  };
})();
