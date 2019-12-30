const router = require("express").Router();
const verification = require("./verification");

router.use("/verification", verification);

module.exports = router;
