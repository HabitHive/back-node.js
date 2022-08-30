import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const dummyaccesstoken1 = jwt.sign(
  { key1: process.env.TOKEN1_RANDOMVALUE1 },
  process.env.TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);
const dummyaccesstoken2 = jwt.sign(
  { key1: process.env.TOKEN1_RANDOMVALUE2 },
  process.env.TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);
const dummyaccesstoken3 = jwt.sign(
  { key1: process.env.TOKEN1_RANDOMVALUE3 },
  process.env.TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);
const dummyaccesstoken4 = jwt.sign(
  { key1: process.env.TOKEN1_RANDOMVALUE4 },
  process.env.TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);
const dummyaccesstoken5 = jwt.sign(
  { key1: process.env.TOKEN1_RANDOMVALUE5 },
  process.env.TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);
const dummyaccesstoken6 = jwt.sign(
  { key1: process.env.TOKEN1_RANDOMVALUE6 },
  process.env.TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);
const dummyaccesstoken7 = jwt.sign(
  { key1: process.env.TOKEN1_RANDOMVALUE7 },
  process.env.TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);
const dummyaccesstoken8 = jwt.sign(
  { key1: process.env.TOKEN1_RANDOMVALUE8 },
  process.env.TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);
const dummyaccesstoken9 = jwt.sign(
  { key1: process.env.TOKEN1_RANDOMVALUE9 },
  process.env.TOKEN_SECRET,
  {
    expiresIn: "1h",
  }
);

//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------

const dummyrefreshtoken1 = jwt.sign(
  {
    key2: dummyaccesstoken7,
    key3: process.env.TOKEN3_RANDOMVALUE1,
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "7d" }
);
const dummyrefreshtoken2 = jwt.sign(
  {
    key2: dummyaccesstoken2,
    key3: process.env.TOKEN3_RANDOMVALUE2,
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "7d" }
);
const dummyrefreshtoken3 = jwt.sign(
  {
    key2: dummyaccesstoken6,
    key3: process.env.TOKEN3_RANDOMVALUE3,
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "7d" }
);
const dummyrefreshtoken4 = jwt.sign(
  {
    key2: dummyaccesstoken8,
    key3: process.env.TOKEN3_RANDOMVALUE4,
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "7d" }
);
const dummyrefreshtoken5 = jwt.sign(
  {
    key2: dummyaccesstoken4,
    key3: process.env.TOKEN3_RANDOMVALUE5,
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "7d" }
);
const dummyrefreshtoken6 = jwt.sign(
  {
    key2: dummyaccesstoken1,
    key3: process.env.TOKEN3_RANDOMVALUE6,
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "7d" }
);
const dummyrefreshtoken7 = jwt.sign(
  {
    key2: dummyaccesstoken9,
    key3: process.env.TOKEN3_RANDOMVALUE7,
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "7d" }
);
const dummyrefreshtoken8 = jwt.sign(
  {
    key2: dummyaccesstoken5,
    key3: process.env.TOKEN3_RANDOMVALUE8,
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "7d" }
);
const dummyrefreshtoken9 = jwt.sign(
  {
    key2: dummyaccesstoken3,
    key3: process.env.TOKEN3_RANDOMVALUE9,
  },
  process.env.TOKEN_SECRET,
  { expiresIn: "7d" }
);

export default {
  dummyaccesstoken1,
  dummyaccesstoken2,
  dummyaccesstoken3,
  dummyaccesstoken4,
  dummyaccesstoken5,
  dummyaccesstoken6,
  dummyaccesstoken7,
  dummyaccesstoken8,
  dummyaccesstoken9,
  dummyrefreshtoken1,
  dummyrefreshtoken2,
  dummyrefreshtoken3,
  dummyrefreshtoken4,
  dummyrefreshtoken5,
  dummyrefreshtoken6,
  dummyrefreshtoken7,
  dummyrefreshtoken8,
  dummyrefreshtoken9,
};
