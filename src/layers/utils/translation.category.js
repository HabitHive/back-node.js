export default (categoryArr, option) => {
  const ko = [
    "운동",
    "공부",
    "취미",
    "다이어트",
    "청소",
    "건강",
    "자기개발",
    "시험",
    "요리",
    "자격증",
    "독서",
    "기타",
  ];
  const en = [
    "workout",
    "study",
    "hobby",
    "diet",
    "cleaning",
    "wellness",
    "self-development",
    "test",
    "cook",
    "certificate",
    "book",
    "etc",
  ];

  let category = [];

  if (option === 0) {
    console.log(str);
    categoryArr.map((str) => {
      const indexNum = ko.indexOf(str);
      if (indexNum == -1) {
        console.log(str, "오타남");
      }
      category.push(en[indexNum]);
    });
  } else if (option === 1) {
    categoryArr.map((str) => {
      const indexNum = en.indexOf(str);
      if (indexNum == -1) {
        console.log(str, "오타남");
      }
      category.push(ko[indexNum]);
    });
  }

  return category;
};
