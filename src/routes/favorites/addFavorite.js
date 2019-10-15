const { addFavoriteSchema } = require('../../lib/joiSchemas');

const addFavorite = async (req, res) => {
  const { projectId } = req.body;
  try {
    await addFavoriteSchema.validateAsync({ projectId });
    const { id: userId } = req.auth;
    const { owner_id: ownerId } = await req.postgresClient.getProjectOwner(projectId);
    if (ownerId !== userId) {
      await req.postgresClient.addToFavorites(userId, projectId);
      res.status(201).send({ message: 'Favorite added' });
    } else {
      res.status(400).send({ message: 'You can\'t favorite your own project' });
    }
  } catch (err) {
    req.logger.error(err);
    res.status(400).send({ message: 'Invalid data' });
  }
};

module.exports = addFavorite;
