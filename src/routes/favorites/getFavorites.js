const camelCaseKeys = require('camelcase-keys');

const getFavorites = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const { id: userId } = req.auth;
    const dbResponse = await req.postgresClient.getFavoritesByUser(userId, page);
    return res.status(200).send({ projects: camelCaseKeys(dbResponse) });
  } catch (err) {
    req.logger.error(err);
    return res.status(400).send({ message: 'Error getting project' });
  }
};

module.exports = getFavorites;
