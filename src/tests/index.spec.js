const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");
const { ShortUrl, Stats } = require("../models");
const { BASE_URL } = require("../utils/environment");

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

  describe("Redirect", () => {
    it("should redirect to the long_url when a valid short_url param is supplied", async () => {
      const res = await chai.request(app).get(`/${short_url.substring(BASE_URL.length, short_url.length)}`);

      res.should.to.redirectTo(long_url);
      res.should.to.redirect;
    });

    it("should not redirect when an invalid params is supplied", async () => {
      const res = await chai.request(app).get(`/badparams`);
      res.should.to.not.redirect;
    });
  });

  describe("/statistic/{url_path}", () => {
    it("should return an error when an invalid url_path is supplied", async () => {
      const res = await chai.request(app).get("/statistic/notfound");

      res.should.have.status(404);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("error");
      res.body.status.should.equal(false);
      res.body.code.should.equal(404);
      res.body.error.should.equal("url not found");
    });

    it("should return relevant statistics when a valid url_path is supplied", async () => {
      const res = await chai.request(app).get(`/statistic/${short_url.substring(BASE_URL.length, short_url.length)}`);

      res.should.have.status(200);
      res.body.should.have.property("status");
      res.body.should.have.property("code");
      res.body.should.have.property("message");
      res.body.should.have.property("data");
      res.body.data.should.have.property("id");
      res.body.data.should.have.property("short_url");
      res.body.data.should.have.property("long_url");
      res.body.data.should.have.property("created_at");
      res.body.data.should.have.property("totalclicks");
      res.body.data.should.have.property("visitors");
      res.body.data.visitors.should.have.property("uniquevisitors");
      res.body.data.visitors.should.have.property("browsers");
      res.body.data.visitors.should.have.property("platforms");
      res.body.data.visitors.should.have.property("devices");
      res.body.data.visitors.should.have.property("countries");
      res.body.data.visitors.should.have.property("timezones");
      res.body.data.visitors.should.have.property("cities");
      res.body.status.should.equal(true);
      res.body.code.should.equal(200);
      res.body.data.should.be.an("object");
      res.body.data.visitors.should.be.an("object");
      res.body.message.should.equal("stats retrieved");
      res.body.data.visitors.uniquevisitors.should.equal(1);
      res.body.data.visitors.browsers.length.should.equal(1);
      res.body.data.visitors.platforms.length.should.equal(1);
      res.body.data.visitors.devices.length.should.equal(1);
      res.body.data.visitors.countries.length.should.equal(1);
      res.body.data.visitors.timezones.length.should.equal(1);
      res.body.data.visitors.cities.length.should.equal(1);
    });
  });
});
