const crypto = require("crypto");
const { promisify } = require("util");
const pbkdf2 = promisify(crypto.pbkdf2);
const { SALT } = require("../config/environment");

async function hashPassword(password) {
  return (await pbkdf2(password, SALT, 1000, 16, "sha512")).toString("hex");
}

async function verifyPassword({ password, hashedPassword }) {
  return hashedPassword === (await hashPassword(password));
}

module.exports = {
  hashPassword,
  verifyPassword,
};
