const getProject = async (req, res) => {
  const { projectId } = req.params;
  if (projectId) {
    try {
      const dbResponse = await req.postgresClient.getProjectById(projectId);
      res.status(200).send(dbResponse);
    } catch (err) {
      req.logger.error(err);
      res.status(400).send('Error getting project');
    }
  }
  res.status(400).send('Supply a projectId');
};

module.exports = getProject;
