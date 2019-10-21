const removeFavorite = async (req, res) => {
  const { projectId } = req.params;
  if (projectId) {
    try {
      const { id: userId } = req.auth;
      await req.postgresClient.deleteFromFavorites(userId, projectId);
      return res.status(200).send({ message: 'Favorite removed' });
    } catch (err) {
      req.logger.error(err);
      return res.status(400).send({ message: 'Invalid data' });
    }
  }
  return res.status(400).send({ message: 'Supply a projectId' });
};

module.exports = removeFavorite;
