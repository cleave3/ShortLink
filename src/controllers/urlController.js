const { encode } = require("../services/urlService");
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
}

module.exports = UrlController;
