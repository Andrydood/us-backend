const camelCaseKeys = require('camelcase-keys');

const getProject = async (req, res) => {
  const { projectId } = req.params;
  if (projectId) {
    try {
      const dbResponse = await req.postgresClient.getProjectById(projectId);
      if (dbResponse) {
        return res.status(200).send(camelCaseKeys(dbResponse));
      }
      return res.status(400).send({ message: 'Not found' });
    } catch (err) {
      req.logger.error({ error: JSON.stringify(err) });
      return res.status(500).send({ message: 'Server error' });
    }
  }
  return res.status(400).send({ message: 'Supply a projectId' });
};

module.exports = getProject;
