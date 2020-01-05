const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');

const JWT_TTL = '3 days';
const SALT_ROUNDS = 10;

const authenticationKey = config.get('authenticationKey');

const generateAuthToken = (username, id, initialSetupIsComplete) => jwt.sign(
  {
    username,
    id,
    initialSetupIsComplete,
  },
  authenticationKey,
  { expiresIn: JWT_TTL },
);

const verifyAuthToken = (token) => (token ? jwt.verify(token, authenticationKey) : false);

const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

const checkPassword = (password, hash) => bcrypt.compare(password, hash);

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  hashPassword,
  checkPassword,
};
