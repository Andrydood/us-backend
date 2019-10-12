const { verifyAuthToken } = require('../lib/authentication');

const requireAuthentication = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.headers.authorization;

  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }

  try {
    const decoded = verifyAuthToken(token);
    if (decoded.username) {
      req.auth = decoded;
      return next();
    }
    return res.status(400).send('No username found');
  } catch (ex) {
    return res.status(400).send('Invalid token.');
  }
};

module.exports = requireAuthentication;
