const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  if (projectId) {
    try {
      const { id: userId } = req.auth;
      const { owner_id: ownerId } = await req.postgresClient.getProjectOwner(projectId);
      if (ownerId === userId) {
        await req.postgresClient.deleteProject(userId, projectId);
        res.status(200).send({ message: 'Project deleted' });
      } else {
        res.status(400).send({ message: 'Invalid request' });
      }
    } catch (err) {
      req.logger.error(err);
      res.status(400).send({ message: 'Invalid data' });
    }
  }
  res.status(400).send({ message: 'Supply a projectId' });
};

module.exports = deleteProject;
