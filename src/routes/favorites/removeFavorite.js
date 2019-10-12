const removeFavorite = async (req, res) => {
  const { projectId } = req.params;
  if (projectId) {
    try {
      const { username } = req.auth;
      const pgResponse = await req.postgresClient.deleteFromFavorites(username, projectId);
      res.status(200).send(pgResponse);
    } catch (err) {
      req.logger.error(err);
      res.status(400).send('Invalid data');
    }
  }
  res.status(400).send('Supply a projectId');
};

module.exports = removeFavorite;
