const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShortUrl extends Model {
    static associate(models) {
      ShortUrl.hasMany(models.Stats, {
        foreignKey: "url_id",
        as: "stats",
      });
    }
  }
  ShortUrl.init(
    {
      short_url: DataTypes.STRING,
      long_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ShortUrl",
    }
  );
  return ShortUrl;
};
