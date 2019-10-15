const express = require('express');

const requireAuthentication = require('../../middleware/requireAuthentication');
const list = require('./list');
const create = require('./create');
const getProject = require('./getProject');
const deleteProject = require('./deleteProject');
const getUserProjects = require('./user');

const router = express.Router();

router.use(requireAuthentication);
router.post('/', create);
router.get('/', list);
router.get('/:projectId', getProject);
router.get('/user/:username', getUserProjects);
router.delete('/:projectId', deleteProject);

module.exports = router;
