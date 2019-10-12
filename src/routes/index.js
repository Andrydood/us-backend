const express = require('express');

const health = require('./health');
const user = require('./user');
const projects = require('./projects');
const favorites = require('./favorites');
const docs = require('./docs');

const router = express.Router();

router.use('/docs', docs);
router.use('/health', health);
router.use('/projects', projects);
router.use('/favorites', favorites);
router.use('/user', user);

module.exports = router;
