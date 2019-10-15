const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'US-Backend',
      version: '1.0.0',
    },
  },
  apis: ['src/routes/*/swagger.js'],
};

const specs = swaggerJsdoc(options);

const router = express.Router();

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(specs));

module.exports = router;
