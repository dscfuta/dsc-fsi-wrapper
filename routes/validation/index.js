const router = require("express").Router();
const resetIfNeeded = require("../../middleware/resetIfNeeded");
const { ResetCredentialsTypes } = require("../../ResetCredentials");
const validateBVN = require("./validateBVN");
const validateMultipleBVNs = require("./validateMultipleBVNs");

router.use(resetIfNeeded(ResetCredentialsTypes.VALIDATION));
router.post("/single/:BVN", validateBVN);
router.post("/multiple", validateMultipleBVNs);

module.exports = router;
