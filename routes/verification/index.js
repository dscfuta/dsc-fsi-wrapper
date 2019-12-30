const router = require("express").Router();
const resetIfNeeded = require("../../middleware/resetIfNeeded");
const { ResetCredentialsTypes } = require("../../ResetCredentials");
const verifyBVN = require("./verifyBVN");
const verifyMultipleBVN = require("./verifyMultipleBVN");
const watchlistStatus = require("./watchlistStatus");

router.use(resetIfNeeded(ResetCredentialsTypes.VERIFICATION));

router.post("/single/:BVN", verifyBVN);
router.post("/multiple/:BVNs", verifyMultipleBVN);
router.get("/watchlistStatus/:BVN", watchlistStatus);

module.exports = router;
