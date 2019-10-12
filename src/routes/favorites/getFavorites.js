const getFavorites = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const { username } = req.auth;
    const dbResponse = await req.postgresClient.getFavoritesByUser(username, page);
    res.status(200).send(dbResponse);
  } catch (err) {
    req.logger.error(err);
    res.status(400).send('Error getting project');
  }
};

module.exports = getFavorites;
