const camelCaseKeys = require('camelcase-keys');

const list = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const dbResponse = await req.postgresClient.getAllProjects(page);
    return res.status(200).send({ projects: camelCaseKeys(dbResponse) });
  } catch (err) {
    req.logger.error(err);
    return res.status(400).send({ message: 'Error getting projects' });
  }
};

module.exports = list;
