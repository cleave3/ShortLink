const express = require("express");

const PORT = process.env.PORT || 8080;

const app = express();

app.get("/", (req, res) => res.status(200).json({ status: true, code: 200, message: "App is live" }));

app.listen(PORT, () => console.log(`App is live on port ${PORT}`));

module.exports = app;
