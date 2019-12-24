const express = require('express');

const requireAuthentication = require('../../middleware/requireAuthentication');
const create = require('./create');
const send = require('./send');
const conversation = require('./conversation');
const myProjects = require('./my-projects');
const otherProjects = require('./other-projects');

const router = express.Router();

router.use(requireAuthentication);
router.post('/create', create);
router.post('/send', send);
router.get('/conversation/:conversationId', conversation);
router.get('/my-projects', myProjects);
router.get('/other-projects', otherProjects);

module.exports = router;
