const router = require("express").Router();
const resetIfNeeded = require("../../middleware/resetIfNeeded");
const { ResetCredentialsTypes } = require("../../ResetCredentials");
const validateBVN = require("./validateBVN");

router.use(resetIfNeeded(ResetCredentialsTypes.VALIDATION));
router.post("/single/:BVN", validateBVN);

module.exports = router;
