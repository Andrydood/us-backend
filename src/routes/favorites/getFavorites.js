const camelCaseKeys = require('camelcase-keys');

const getFavorites = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const { id: userId } = req.auth;
    const dbResponse = await req.postgresClient.getFavoritesByUser(userId, page);
    if (dbResponse) {
      return res.status(200).send({ projects: camelCaseKeys(dbResponse) });
    }
    return res.status(400).send({ message: 'Not found' });
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = getFavorites;
