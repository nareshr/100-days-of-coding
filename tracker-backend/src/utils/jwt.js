// const jwt = require('jsonwebtoken');
// const secret = process.env.JWT_SECRET || 'change-me-please';
// function sign(payload, opts = {}) {
//   return jwt.sign(payload, secret, { expiresIn: opts.expiresIn || '7d' });
// }
// function verify(token) {
//   return jwt.verify(token, secret);
// }
// module.exports = { sign, verify };

// utils/jwt.js
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "replace_me";

export function signToken(payload, opts = {}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: opts.expiresIn || "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}
