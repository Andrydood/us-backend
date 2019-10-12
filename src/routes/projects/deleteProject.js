const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  if (projectId) {
    try {
      const { username } = req.auth;
      const { owner } = await req.postgresClient.getProjectById(projectId);
      if (owner === username) {
        const pgResponse = await req.postgresClient.deleteProject(username, projectId);
        res.status(200).send(pgResponse);
      } else {
        res.status(400).send('Invalid request');
      }
    } catch (err) {
      req.logger.error(err);
      res.status(400).send('Invalid data');
    }
  }
  res.status(400).send('Supply a projectId');
};

module.exports = deleteProject;
