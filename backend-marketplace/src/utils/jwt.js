const jwt = require("jsonwebtoken");

const EXPIRES_IN = "7d";

exports.signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: EXPIRES_IN });

exports.verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
