const { encode, decode } = require("../services/urlService");
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
}

module.exports = UrlController;
