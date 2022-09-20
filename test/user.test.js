const app = require("../src/test");
const request = require("supertest");
const agent = request.agent(app);

let token;
let session;
describe("회원가입", () => {
  test("1번 유저 로컬 회원가입 하기(성공)", (done) => {
    request(app)
      .post("/api/user/signup")
      .send({
        email: "test001@test.com",
        password: "test",
        nickname: "test001",
      })
      .expect(201)
      .end((err, res) => {
        console.log(res.body);
        done();
      });
  });
});
