const express = require('express');

const requireAuthentication = require('../../middleware/requireAuthentication');
const addFavorite = require('./addFavorite');
const getFavorites = require('./getFavorites');
const deleteFavorite = require('./deleteFavorite');

const router = express.Router();

router.use(requireAuthentication);
router.post('/', addFavorite);
router.get('/', getFavorites);
router.delete('/', deleteFavorite);

module.exports = router;
