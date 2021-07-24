const PORT = process.env.PORT || 8080;
const BASE_URL = process.env.NODE_ENV.BASE_URL || `http://localhost:${PORT}/`;

module.exports = { PORT, BASE_URL };
