const express = require('express');

const requireAuthentication = require('../../middleware/requireAuthentication');

const login = require('./login');
const create = require('./create');
const profile = require('./profile');
const refresh = require('./refresh');
const setup = require('./setup');

const router = express.Router();

router.post('/login', login);
router.post('/create', create);
router.get('/profile/:username', profile);
router.get('/refresh', requireAuthentication, refresh);
router.post('/setup', requireAuthentication, setup);

module.exports = router;
