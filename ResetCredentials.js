const {
  toBase64,
  sha256,
  getTodaysDate,
  aesEncrypt,
  aesDecrypt,
} = require("./utils");

const debug = require("debug")("fsi-wrapper:ResetCredentials");
const fetch = require("node-fetch");

const API_URL = process.env.API_URL;

const endpointMap = {
  fp: "fp",
  verify: "bvnr",
  validate: "BVNPlaceHolder",
};

class ResetCredentials {
  static Types = Object.freeze({
    FINGERPRINT: "fp",
    VERIFICATION: "verify",
    VALIDATION: "validate",
  });

  _credentials = {
    fp: null,
    verify: null,
    validate: null,
  };

  reset(type = ResetCredentials.Types.VERIFICATION) {
    return new Promise((resolve, reject) => {
      debug(`Performing /Reset for type ${type}`);
      if (this._credentials[type]) {
        debug(
          `Already performed /Reset for ${type}, resolving with cached values`
        );
        resolve(this._credentials[type]);
      } else {
        debug(
          `No cached values for ${type}, making request to sandbox API (${endpointMap[type]}/Reset)`
        );
        const organisationCode = process.env.ORGANISATION_CODE;
        const sandboxKey = process.env.SANDBOX_KEY;
        fetch(`${API_URL}/${endpointMap[type]}/Reset`, {
          method: "POST",
          headers: {
            OrganisationCode: toBase64(organisationCode),
            "Sandbox-Key": sandboxKey,
          },
        })
          .then(res => {
            debug(`Got response with status code ${res.status}`);
            if (res.status === 200) {
              const header = name => res.headers.get(name);
              const details = {
                name: header("name"),
                ivKey: header("ivkey"),
                aesKey: header("aes_key"),
                password: header("password"),
                email: header("email"),
                code: header("code"),
                name: header("name"),
              };
              const getRequestHeaders = () => {
                const headers = {
                  OrganisationCode: toBase64(organisationCode),
                  "Sandbox-Key": sandboxKey,
                  SIGNATURE: sha256(
                    details.code + getTodaysDate() + details.password
                  ),
                  SIGNATURE_METH: "SHA256",
                  Authorization: toBase64(
                    `${details.code}:${details.password}`
                  ),
                  "Content-Type": "application/json",
                  Accept: "application/json",
                };
                return headers;
              };
              const encryptBody = aesEncrypt(details.aesKey, details.ivKey);
              const decryptBody = aesDecrypt(details.aesKey, details.ivKey);
              const credentials = {
                details,
                getRequestHeaders,
                encryptBody,
                decryptBody,
              };
              this._credentials[type] = credentials;
              resolve(credentials);
            } else {
              res.text().then(res => {
                debug(`Request failed with response ${res}`);
                reject(res);
              });
            }
          })
          .catch(err => {
            debug(`An error occured: ${err}`);
            reject(err);
          });
      }
    });
  }
}

module.exports = {
  default: new ResetCredentials(),
  ResetCredentialsTypes: ResetCredentials.Types,
};
