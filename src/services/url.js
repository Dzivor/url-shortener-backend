const crypto = require("crypto");

function md5To4Chars(str) {
  return crypto.createHash("md5").update(str).digest("hex").slice(0, 4);
}

console.log(md5To4Chars("Google.com"));
