const { addFavoriteSchema } = require('../../lib/joiSchemas');

const addFavorite = async (req, res) => {
  const { projectId } = req.body;
  const favoriteData = { projectId };
  try {
    await addFavoriteSchema.validateAsync(favoriteData);
    const { username } = req.auth;
    const { owner } = await req.postgresClient.getProjectById(projectId);
    if (owner !== username) {
      const pgResponse = await req.postgresClient.addToFavorites(username, projectId);
      res.status(201).send(pgResponse);
    } else {
      res.status(400).send('You can\'t favorite your own project');
    }
  } catch (err) {
    req.logger.error(err);
    res.status(400).send('Invalid data');
  }
};

module.exports = addFavorite;
