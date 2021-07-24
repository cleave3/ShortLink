const express = require("express");
const { PORT } = require("./utils/environment");
const router = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(PORT, () => console.log(`App is live on port ${PORT}`));

module.exports = app;
