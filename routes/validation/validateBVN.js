const debug = require("debug")("fsi-wrapper:validateBVN");
const { formatResponse, debugErrorResponse, API_URL } = require("../../utils");
const fetch = require("node-fetch");

function validateBVN(req, res, next) {
  const { getRequestHeaders, encryptBody, decryptBody } = req.apiCredentials;
  const BVN = req.params.BVN;
  const body = JSON.stringify({
    BVN,
    ...req.body,
  });
  debug(`Making a request to /BVNPlaceHolder/ValidateRecord`);
  return fetch(`${API_URL}/BVNPlaceHolder/ValidateRecord`, {
    method: "POST",
    headers: {
      ...getRequestHeaders(),
    },
    body: encryptBody(body),
  })
    .then(sandboxRes => {
      debug(`Got response with status code ${sandboxRes.status}`);
      return sandboxRes.text().then(encryptedRes => {
        const resp = decryptBody(encryptedRes);
        const respJSON = JSON.parse(resp);
        if (sandboxRes.status !== 200) {
          debugErrorResponse(debug)(respJSON);
        }
        res.status(sandboxRes.status).json(
          formatResponse({
            status: sandboxRes.status,
            response: respJSON,
          })
        );
      });
    })
    .catch(next);
}

module.exports = validateBVN;
