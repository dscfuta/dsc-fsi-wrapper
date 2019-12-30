const debug = require("debug")("fsi-wrapper:verifyBVN");
const { formatResponse, debugErrorResponse, API_URL } = require("../../utils");
const fetch = require("node-fetch");

function verifyBVN(req, res, next) {
  const { getRequestHeaders, encryptBody, decryptBody } = req.apiCredentials;
  const BVN = req.params.BVN;
  const body = JSON.stringify({
    BVN,
  });
  debug(`Making a request to /bvnr/VerifySingleBVN`);
  return fetch(`${API_URL}/bvnr/VerifySingleBVN`, {
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

module.exports = verifyBVN;
