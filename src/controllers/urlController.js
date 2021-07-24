const { encode, decode, getShortUrl } = require("../services/urlService");
const { success, badRequest } = require("../utils/responseHelper");

class UrlController {
  static async encode({ body: { long_url } }, res) {
    try {
      const encodedurl = await encode(long_url);
      return success(res, true, encodedurl.code, encodedurl.url, "url encoded sucessfully");
    } catch ({ code, message }) {
      return badRequest(res, false, code, message);
    }
  }

  static async decode({ body: { short_url } }, res) {
    try {
      const url = await decode(short_url);
      return success(res, true, 200, url, "url decoded sucessfully");
    } catch ({ code, message }) {
      return badRequest(res, false, code, message);
    }
  }

  static async visitShortUrl(req, res) {
    try {
      const url = await getShortUrl(req.params.path);
      res.redirect(url.long_url);
      res.sendStatus(304);
    } catch ({ message }) {
      console.log("message ", message);
      res.render("404", { message });
      res.sendStatus(200);
    }
  }
}

module.exports = UrlController;
