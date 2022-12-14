const Tag = require("../../models/tag");
const User = require("../../models/user");
const translation = require("../utils/translation.category");

module.exports = new (class AdminService {
  input = async (req, res) => {
    const { list } = req.body;
    const listSplit = list.split("/");
    let allTags = [];
    listSplit.map((tagInfo) => {
      let categoryArr = tagInfo.split(",");
      const tagName = categoryArr.shift();
      const color = categoryArr.pop();
      const categoryList = translation(categoryArr, 0);
      if (categoryList.length == 0) {
        res.status(400).send("오타남");
      }
      const category = categoryList.join("#");
      allTags.push({ tag_name: tagName, category, color: +color });
    });

    await Tag.bulkCreate(allTags);
    res.status(201).send("완료");
  };

  money = async (req, res) => {
    let user_id = res.locals.userId;
    if (req.body.id) user_id = req.body.id;

    let point = 10040000;
    if (req.body.pt) point = req.body.pt;

    await User.update({ point }, { where: { user_id } });
    return res.status(201).send("넣어둬 넣어둬");
  };
})();
