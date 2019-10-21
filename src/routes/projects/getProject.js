const camelCaseKeys = require('camelcase-keys');

const getProject = async (req, res) => {
  const { projectId } = req.params;
  if (projectId) {
    try {
      const dbResponse = await req.postgresClient.getProjectById(projectId);
      return res.status(200).send(camelCaseKeys(dbResponse));
    } catch (err) {
      req.logger.error(err);
      return res.status(400).send({ message: 'Error getting project' });
    }
  }
  return res.status(400).send({ message: 'Supply a projectId' });
};

module.exports = getProject;
