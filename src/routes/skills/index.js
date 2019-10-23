const express = require('express');

const list = require('./list');

const router = express.Router();

router.get('/', list);

module.exports = router;
