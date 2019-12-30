const debug = require("debug")("fsi-wrapper:reset");
const {
  default: ResetCredentials,
  ResetCredentialsTypes
} = require("../ResetCredentials");

function resetIfNeeded(type = ResetCredentialsTypes.VERIFICATION) {
  return function reset(req, res, next) {
    debug(`reset middleware of type ${type} invoked`);
    ResetCredentials.reset(type).then(credentials => {
      req.apiCredentials = credentials;
      next();
    });
  };
}

module.exports = resetIfNeeded;
