const router = require("express").Router();
const verification = require("./verification");
const details = require("./details");

router.use("/verification", verification);
router.use("/details", details);

module.exports = router;
