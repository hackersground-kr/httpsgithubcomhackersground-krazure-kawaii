const cryptoJs = require("crypto-js");

// sha256 해시 함수
function hash(text) {
  return cryptoJs.SHA256(text).toString();
}

module.exports = hash;