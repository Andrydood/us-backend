const camelCaseKeys = require('camelcase-keys');

const getUserProjects = async (req, res) => {
  const { username } = req.params;
  if (username) {
    try {
      const page = req.query.page || 0;
      const dbResponse = await req.postgresClient.getUserProjects(username, page);
      return res.status(200).send({ projects: camelCaseKeys(dbResponse) });
    } catch (err) {
      req.logger.error(err);
      return res.status(400).send({ message: 'Error getting projects' });
    }
  }
  return res.status(400).send({ message: 'Supply a username' });
};

module.exports = getUserProjects;
