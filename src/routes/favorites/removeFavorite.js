const { removeFavoriteSchema } = require('../../lib/joiSchemas');

const removeFavorite = async (req, res) => {
  const { projectId } = req.body;
  const favoriteData = { projectId };
  try {
    await removeFavoriteSchema.validateAsync(favoriteData);
    const { username } = req.auth;
    const pgResponse = await req.postgresClient.deleteFromFavorites(username, projectId);
    res.status(200).send(pgResponse);
  } catch (err) {
    req.logger.error(err);
    res.status(400).send('Invalid data');
  }
};

module.exports = removeFavorite;
