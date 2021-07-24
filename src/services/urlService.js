const sequelize = require("sequelize");
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

  static async getStats(params) {
    const url = await ShortUrl.findOne({ where: { short_url: params } });
    if (!url) throwError(404, "url not found");

    const browsers = await UrlService.getStatsByDevicesTypes(params);
    const platforms = await UrlService.getStatsByPlatforms(params);
    const devices = await UrlService.getStatsByDeviceTypes(params);
    const uniquevisitors = await UrlService.getUniquevisitors(params);
    const timezones = await UrlService.getStatsByTimeZone(params);
    const countries = await UrlService.getStatsByCountry(params);
    const cities = await UrlService.getStatsByCities(params);
    const stats = await Stats.findAll({ where: { url_id: params } });

    return {
      id: url.id,
      short_url: `${BASE_URL}${url.short_url}`,
      long_url: url.long_url,
      created_at: url.createdAt,
      totalclicks: stats.length,
      visitors: {
        uniquevisitors,
        browsers,
        platforms,
        devices,
        countries,
        timezones,
        cities,
      },
    };
  }

  static async getStatsByDevicesTypes(url_id) {
    const browsers = await Stats.findAll({
      where: { url_id },
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("browser")), "browser"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["browser", "os", "device"],
    });

    return browsers;
  }

  static async getStatsByPlatforms(url_id) {
    const platforms = await Stats.findAll({
      where: { url_id },
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("os")), "os"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["os"],
    });

    return platforms;
  }

  static async getStatsByDeviceTypes(url_id) {
    const devices = await Stats.findAll({
      where: { url_id },
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("device")), "device"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["device"],
    });

    return devices;
  }

  static async getUniquevisitors(url_id) {
    const uniquevisitors = await Stats.findAll({
      where: { url_id },
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("ip")), "ip"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["ip"],
    });

    return uniquevisitors.length;
  }

  static async getStatsByTimeZone(url_id) {
    const timezones = await Stats.findAll({
      where: { url_id },
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("timezone")), "timezone"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["timezone"],
    });

    return timezones;
  }

  static async getStatsByCountry(url_id) {
    const countries = await Stats.findAll({
      where: { url_id },
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("country")), "country"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["country"],
    });

    return countries;
  }

  static async getStatsByCities(url_id) {
    const cities = await Stats.findAll({
      where: { url_id },
      attributes: [
        [sequelize.fn("DISTINCT", sequelize.col("city")), "city"],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: ["city"],
    });

    return cities;
  }
}

module.exports = UrlService;
