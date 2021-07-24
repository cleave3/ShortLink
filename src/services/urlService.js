const shortid = require("shortid");
const { validateLongUrl } = require("../validation/validator");
const { ShortUrl } = require("../models");
const { BASE_URL } = require("../utils/environment");

class UrlService {
  static async encode(long_url) {
    validateLongUrl(long_url);

    const url = await ShortUrl.findOne({ where: { long_url } });

    if (url) return { code: 200, url: { short_url: `${BASE_URL}${url.short_url}` } };

    const data = await ShortUrl.create({ short_url: shortid.generate(), long_url });

    return { code: 201, url: { short_url: `${BASE_URL}${data.short_url}` } };
  }
}

module.exports = UrlService;
