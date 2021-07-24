const { Router } = require("express");
const { encode } = require("../controllers/urlController");

const router = Router();

router.get("/", (req, res) => res.status(200).json({ status: true, code: 200, message: "App is live" }));
router.post("/encode", encode);

module.exports = router;
