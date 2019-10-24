const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

const JWT_TTL = '3 days';
const SALT_ROUNDS = 10;

const authenticationKey = config.get('authenticationKey');

const generateAuthToken = (username, id) => jwt.sign(
  {
    username,
    id,
  },
  authenticationKey,
  { expiresIn: JWT_TTL },
);

const verifyAuthToken = (token) => jwt.verify(token, authenticationKey);

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

const checkPassword = (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  hashPassword,
  checkPassword,
};
