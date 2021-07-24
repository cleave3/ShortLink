const shortid = require("shortid");
const { validateLongUrl, validateShortUrl } = require("../validation/validator");
const { ShortUrl } = require("../models");
const { BASE_URL } = require("../utils/environment");
const { throwError } = require("../utils/responseHelper");

class UrlService {
  static async encode(long_url) {
    validateLongUrl(long_url);

    const url = await ShortUrl.findOne({ where: { long_url } });

    if (url) return { code: 200, url: { short_url: `${BASE_URL}${url.short_url}` } };

    const data = await ShortUrl.create({ short_url: shortid.generate(), long_url });

    return { code: 201, url: { short_url: `${BASE_URL}${data.short_url}` } };
  }

  static async decode(short_url) {
    validateShortUrl(short_url);

    const params = short_url.substring(BASE_URL.length, short_url.length);

    const url = await ShortUrl.findOne({ where: { short_url: params } });

    if (!url) throwError(404, "url not found");

    return { long_url: url.long_url };
  }
}

module.exports = UrlService;
