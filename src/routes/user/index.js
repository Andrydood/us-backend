const express = require('express');

const login = require('./login');
const create = require('./create');
const profile = require('./profile');

const router = express.Router();

router.post('/login', login);
router.post('/create', create);
router.get('/profile/:username', profile);

module.exports = router;
