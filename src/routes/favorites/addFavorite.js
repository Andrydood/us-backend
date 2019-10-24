const { addFavoriteSchema } = require('../../lib/joiSchemas');

const addFavorite = async (req, res) => {
  const { projectId } = req.body;

  try {
    await addFavoriteSchema.validateAsync({ projectId });
  } catch (err) {
    return res.status(400).send({ message: 'Bad request' });
  }

  try {
    const { id: userId } = req.auth;
    await req.postgresClient.addToFavorites(userId, projectId);
    return res.status(201).send({ message: 'Favorite added' });
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = addFavorite;
