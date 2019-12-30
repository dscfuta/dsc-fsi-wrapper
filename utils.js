const crypto = require("crypto");

const toBase64 = string => Buffer.from(string).toString("base64");
exports.toBase64 = toBase64;

const sha256 = string => {
  const hash = crypto.createHash("sha256");
  hash.update(string);
  return hash.digest("hex");
};
exports.sha256 = sha256;

const aesEncrypt = (aesKey, ivKey) => text => {
  const cipher = crypto.createCipheriv(
    "aes-128-cbc",
    Buffer.from(aesKey),
    ivKey
  );
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString("hex");
};
exports.aesEncrypt = aesEncrypt;

const aesDecrypt = (aesKey, ivKey) => text => {
  const encryptedText = Buffer.from(text, "hex");
  let decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(aesKey),
    ivKey
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};
exports.aesDecrypt = aesDecrypt;

const getTodaysDate = () =>
  new Date()
    .toJSON()
    .slice(0, 10)
    .replace(/-/g, "");
exports.getTodaysDate = getTodaysDate;

const formatResponse = ({ status, response }) => {
  if (status !== 200) {
    return {
      status: "error",
      error: {
        code: response.ResponseCode,
        message: response.Message,
      },
      data: null,
    };
  } else {
    return {
      status: "success",
      error: null,
      data: response.data,
    };
  }
};
exports.formatResponse = formatResponse;

exports.API_URL = process.env.API_URL;

const debugErrorResponse = debug => response => {
  debug(`   ResponseCode: ${response.ResponseCode}`);
  debug(`   Message: ${response.Message}`);
  debug(`   EXPECT: ${JSON.stringify(response.EXPECT)}`);
};
exports.debugErrorResponse = debugErrorResponse;
