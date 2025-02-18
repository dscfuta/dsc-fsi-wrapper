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
    app.use(function(req, res, next) {
      res.status(404).send({
        status: "error",
        data: null,
        error: {
          code: "E_NOTFOUND",
          message: "The requested endpoint does not exist",
        },
      });
    });
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
    const port = process.env.PORT || 8000;
    app.listen(port, function() {
      console.log(`Listening on *:${port}.`);
    });
  })
  .catch(err => {
    debug(`Encountered an error during execution: ${err.message}`);
    console.error(`An error occured: ${err}`);
  });
