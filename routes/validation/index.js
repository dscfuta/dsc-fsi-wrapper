const router = require("express").Router();
const resetIfNeeded = require("../../middleware/resetIfNeeded");
const { ResetCredentialsTypes } = require("../../ResetCredentials");

router.use(resetIfNeeded(ResetCredentialsTypes.VALIDATION));

module.exports = router;
