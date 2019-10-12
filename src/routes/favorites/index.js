const express = require('express');

const requireAuthentication = require('../../middleware/requireAuthentication');
const addFavorite = require('./addFavorite');
const getFavorites = require('./getFavorites');
const removeFavorite = require('./removeFavorite');

const router = express.Router();

router.use(requireAuthentication);
router.post('/', addFavorite);
router.get('/', getFavorites);
router.post('/remove', removeFavorite);

module.exports = router;
