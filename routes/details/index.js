const router = require("express").Router();
const resetIfNeeded = require("../../middleware/resetIfNeeded");
const { ResetCredentialsTypes } = require("../../ResetCredentials");
const getSingleBVN = require("./getSingleBVN");
const getMultipleBVNs = require("./getMultipleBVNs");

router.use(resetIfNeeded(ResetCredentialsTypes.VERIFICATION));

router.get("/single/:BVN", getSingleBVN);
router.get("/multiple/:BVNs", getMultipleBVNs);

module.exports = router;
