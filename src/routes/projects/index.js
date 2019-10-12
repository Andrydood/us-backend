const express = require('express');

const list = require('./list');
const create = require('./create');
const getProject = require('./getProject');
const requireAuthentication = require('../../middleware/requireAuthentication');

const router = express.Router();

router.use(requireAuthentication);
router.post('/', create);
router.get('/', list);
router.get('/:projectId', getProject);

module.exports = router;
