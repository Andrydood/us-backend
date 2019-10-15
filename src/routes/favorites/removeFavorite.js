const removeFavorite = async (req, res) => {
  const { projectId } = req.params;
  if (projectId) {
    try {
      const { id: userId } = req.auth;
      await req.postgresClient.deleteFromFavorites(userId, projectId);
      res.status(200).send({ message: 'Favorite removed' });
    } catch (err) {
      req.logger.error(err);
      res.status(400).send({ message: 'Invalid data' });
    }
  }
  res.status(400).send({ message: 'Supply a projectId' });
};

module.exports = removeFavorite;
