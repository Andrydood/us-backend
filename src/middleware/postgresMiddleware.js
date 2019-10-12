const PostgresClient = require('../lib/postgresClient');

const postgresClient = new PostgresClient();

const postgresMiddleware = (req, res, next) => {
  req.postgresClient = postgresClient;
  return next();
};

module.exports = postgresMiddleware;
