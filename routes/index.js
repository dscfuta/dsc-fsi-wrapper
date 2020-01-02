const router = require("express").Router();
const verification = require("./verification");
const details = require("./details");
const validation = require("./validation");

router.use("/verification", verification);
router.use("/details", details);
router.use("/validation", validation);

module.exports = router;
