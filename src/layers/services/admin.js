const Tag = require("../../models/tag");
const User = require("../../models/user");
const translation = require("../utils/translation.category");

// 태그 생성 메소드... 파일 위치 옮길 예정
module.exports = new (class AdminService {
  input = async (req, res) => {
    const { list } = req.body;
    const listSplit = list.split("/");
    let allTags = [];
    listSplit.map((tagInfo) => {
      let categoryArr = tagInfo.split(",");
      const tagName = categoryArr.shift();
      console.log(tagName, categoryArr);
      const categoryList = translation(categoryArr, 0);
      if (categoryList.length == 0) {
        res.status(400).send("오타남");
      }
      const category = categoryList.join("#");
      allTags.push({ tag_name: tagName, category });
    });

    await Tag.bulkCreate(allTags);
    res.status(201).send("완료");
  };

  money = async (req, res) => {
    const { userId, point } = req.body;
    let user_id = 0;

    userId ? (user_id = userId) : (user_id = 1);
    point ? (point = point) : (point = 10040000);

    await User.update({ point }, { where: { user_id } });
    return res.status(201).send("넣어둬 넣어둬");
  };
})();
