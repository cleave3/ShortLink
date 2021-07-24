const { Router } = require("express");
const { encode, decode } = require("../controllers/urlController");

const router = Router();

router.get("/", (req, res) => res.status(200).json({ status: true, code: 200, message: "App is live" }));
router.post("/encode", encode);
router.post("/decode", decode);

module.exports = router;
