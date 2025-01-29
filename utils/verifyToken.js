const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

const verifyToken = async (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    const isBlacklisted = await Token.exists({ token });
    if (isBlacklisted) throw new Error('Token is blacklisted');
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
};

module.exports = verifyToken;