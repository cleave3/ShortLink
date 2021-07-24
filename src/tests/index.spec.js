const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");

chai.use(chaiHttp);
chai.should();

describe("Api Endpoints", () => {
  it("should get app entry point", async () => {
    const res = await chai.request(app).get("/");
    res.should.have.status(200);
    res.body.should.have.property("status");
    res.body.should.have.property("code");
    res.body.should.have.property("message");
    res.body.status.should.equal(true);
    res.body.code.should.equal(200);
    res.body.message.should.equal("App is live");
  });
});
