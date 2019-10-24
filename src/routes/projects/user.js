const camelCaseKeys = require('camelcase-keys');

const getUserProjects = async (req, res) => {
  const { username } = req.params;
  if (username) {
    try {
      const page = req.query.page || 0;
      const dbResponse = await req.postgresClient.getUserProjects(username, page);
      if (dbResponse) {
        return res.status(200).send({ projects: camelCaseKeys(dbResponse) });
      }
      return res.status(400).send({ message: 'Not found' });
    } catch (err) {
      req.logger.error({ error: JSON.stringify(err) });
      return res.status(500).send({ message: 'Server error' });
    }
  }
  return res.status(400).send({ message: 'Supply a username' });
};

module.exports = getUserProjects;
