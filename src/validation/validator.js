const { throwError } = require("../utils/responseHelper");

const valid_url_pattern = /(\b(https?|ftp|file):\/\/|www)[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|]/;

exports.validateLongUrl = long_url => {
  if (!long_url) throwError(400, "long_url is required");
  if (!valid_url_pattern.test(long_url)) throwError(400, "please enter a valid url e.g https://google.com or www.google.com");
};

exports.validateShortUrl = short_url => {
  if (!short_url) throwError(400, "short_url is required");
  if (!valid_url_pattern.test(short_url)) throwError(400, "please enter a valid url e.g http://localhost:8000/testparam");
};
