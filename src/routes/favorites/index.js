const express = require('express');

const requireAuthentication = require('../../middleware/requireAuthentication');
const addFavorite = require('./addFavorite');
const getFavorites = require('./getFavorites');
const removeFavorite = require('./removeFavorite');
const isFavorite = require('./isFavorite');

const router = express.Router();

router.use(requireAuthentication);
router.post('/', addFavorite);
router.get('/', getFavorites);
router.get('/isFavorite/:projectId', isFavorite);
router.delete('/:projectId', removeFavorite);

module.exports = router;
