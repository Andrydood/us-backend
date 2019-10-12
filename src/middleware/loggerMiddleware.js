const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'us-backend' },
  transports: [
    new winston.transports.Console(),
  ],
});

const loggerMiddleware = (req, res, next) => {
  req.logger = logger;
  return next();
};

module.exports = loggerMiddleware;
