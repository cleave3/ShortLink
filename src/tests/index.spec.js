const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const { ShortUrl, Stats } = require("../models");

chai.use(chaiHttp);
chai.should();

const invalid_url = "invalid_url.com";
const long_url = "https://google.com/";
let short_url = "";

describe("Api Endpoints", () => {
  before(async () => {
    await ShortUrl.destroy({ truncate: true, cascade: true, restartIdentity: true });
    await Stats.destroy({ truncate: true, cascade: true, restartIdentity: true });
  });

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

  describe("/encode", () => {
    it("should not encode when long_url is not sent", async () => {
      const res = await chai.request(app).post("/encode").set("Content-Type", "application/json").send({});
      res.should.have.status(400);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("error");
      res.body.status.should.equal(false);
      res.body.code.should.equal(400);
      res.body.error.should.equal("long_url is required");
    });

    it("should not encode when an invalid long_url is sent", async () => {
      const res = await chai.request(app).post("/encode").set("Content-Type", "application/json").send({ long_url: invalid_url });
      res.should.have.status(400);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("error");
      res.body.status.should.equal(false);
      res.body.code.should.equal(400);
      res.body.error.should.equal("please enter a valid url e.g https://google.com or www.google.com");
    });

    it("should encode when a valid long_url is sent", async () => {
      const res = await chai.request(app).post("/encode").set("Content-Type", "application/json").send({ long_url });

      short_url = res.body.data.short_url;

      res.should.have.status(201);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("message");
      res.body.should.have.property("data");
      res.body.status.should.equal(true);
      res.body.code.should.equal(201);
      res.body.message.should.equal("url encoded sucessfully");
      res.body.data.should.be.an("object");
      res.body.data.short_url.should.be.a("string");
    });

    it("should return the same short_url when previously encoded long_url is sent", async () => {
      const res = await chai.request(app).post("/encode").set("Content-Type", "application/json").send({ long_url });

      res.should.have.status(200);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("message");
      res.body.should.have.property("data");
      res.body.status.should.equal(true);
      res.body.code.should.equal(200);
      res.body.message.should.equal("url encoded sucessfully");
      res.body.data.should.be.an("object");
      res.body.data.short_url.should.be.a("string");
      res.body.data.short_url.should.equal(short_url);
    });
  });

  describe("/decode", () => {
    it("should not decode when short_url is not sent", async () => {
      const res = await chai.request(app).post("/decode").set("Content-Type", "application/json").send({});
      res.should.have.status(400);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("error");
      res.body.status.should.equal(false);
      res.body.code.should.equal(400);
      res.body.error.should.equal("short_url is required");
    });

    it("should not decode when an invalid short_url is sent", async () => {
      const res = await chai.request(app).post("/decode").set("Content-Type", "application/json").send({ short_url: invalid_url });
      res.should.have.status(400);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("error");
      res.body.status.should.equal(false);
      res.body.code.should.equal(400);
      res.body.error.should.equal("please enter a valid url e.g http://localhost:8000/testparam");
    });

    it("should not decode when short_url is not found", async () => {
      const res = await chai
        .request(app)
        .post("/decode")
        .set("Content-Type", "application/json")
        .send({ short_url: "http://localhost:8080/notfound" });

      res.should.have.status(404);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("error");
      res.body.status.should.equal(false);
      res.body.code.should.equal(404);
      res.body.error.should.equal("url not found");
    });

    it("should decode when a valid short_url is sent", async () => {
      const res = await chai.request(app).post("/decode").set("Content-Type", "application/json").send({ short_url });

      res.should.have.status(200);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("message");
      res.body.should.have.property("data");
      res.body.status.should.equal(true);
      res.body.code.should.equal(200);
      res.body.message.should.equal("url decoded sucessfully");
      res.body.data.should.be.an("object");
      res.body.data.long_url.should.be.a("string");
      res.body.data.long_url.should.equal(long_url);
    });
  });
});
