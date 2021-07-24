const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stats extends Model {
    static associate(models) {
      Stats.belongsTo(models.ShortUrl, {
        foreignKey: "url_id",
        targetKey: "short_url",
        as: "stats",
      });
    }
  }
  Stats.init(
    {
      url_id: DataTypes.STRING,
      ip: DataTypes.STRING,
      country: DataTypes.STRING,
      timezone: DataTypes.STRING,
      city: DataTypes.STRING,
      device: DataTypes.STRING,
      os: DataTypes.STRING,
      browser: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Stats",
    }
  );
  return Stats;
};
