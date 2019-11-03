const isFavorite = async (req, res) => {
  const { projectId } = req.params;

  try {
    const { id: userId } = req.auth;
    const dbResponse = await req.postgresClient.checkIfFavorite(userId, projectId);
    if (dbResponse) {
      return res.status(200).send(dbResponse);
    }
    return res.status(400).send({ message: 'Not found' });
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = isFavorite;
