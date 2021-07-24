const publicIp = require("public-ip");
const DeviceDetector = require("device-detector-js");
const { lookup } = require("geoip-lite");
const shortid = require("shortid");
const { validateShortUrl, validateLongUrl } = require("../validation/validator");
const { ShortUrl, Stats } = require("../models");
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

  static async getShortUrl(params, useragent) {
    const url = await ShortUrl.findOne({ where: { short_url: params } });
    if (!url) throwError(404, "Oops!!! Page not found. check if you made a typo");
    await UrlService.recordStats(params, useragent);
    return url;
  }

  static async recordStats(url_id, useragent) {
    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(useragent);

    const ip = await publicIp.v4();
    const geo = lookup(ip);

    await Stats.create({
      ip,
      country: geo?.country,
      timezone: geo?.timezone,
      city: geo?.city,
      url_id,
      browser: device?.client?.name,
      os: device?.os?.name,
      device: device?.device?.type,
    });
  }
}

module.exports = UrlService;
