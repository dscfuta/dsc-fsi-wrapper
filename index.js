require("dotenv").config();
const app = require("express")();
const jsonMiddleware = require("express").json;
const debug = require("debug")("fsi-wrapper");
const {
  default: ResetCredentials,
  ResetCredentialsTypes,
} = require("./ResetCredentials");
const router = require("./routes");

debug("Starting application...");
debug("Checking for required environment variables...");

if (
  !(
    process.env.API_URL &&
    process.env.ORGANISATION_CODE &&
    process.env.SANDBOX_KEY
  )
) {
  console.error(
    `A required environment variable is missing. Please ensure a .env file is present.`
  );
  process.exit(-1);
}

Promise.all([
  ResetCredentials.reset(ResetCredentialsTypes.VERIFICATION),
  ResetCredentials.reset(ResetCredentialsTypes.VALIDATION),
  ResetCredentials.reset(ResetCredentialsTypes.FINGERPRINT),
])
  .then(() => {
    app.use(jsonMiddleware());
    app.use("/api", router);
    app.use(function(err, req, res, next) {
      debug(`An internal error occured: ${err.message}`);
      debug(`   ${err.stack}`);
      res.status(500).send({
        status: "error",
        error: {
          code: "E_INTERNAL",
          message: "An internal error occured",
        },
        data: null,
      });
    });
    app.listen(process.env.PORT || 8000, function() {
      console.log(`Listening on *:3000`);
    });
  })
  .catch(err => {
    debug(`Encountered an error during execution: ${err.message}`);
    console.error(`An error occured: ${err}`);
  });
