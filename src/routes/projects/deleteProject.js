const deleteProject = async (req, res) => {
  const { projectId } = req.params;
  if (projectId) {
    try {
      const { id: userId } = req.auth;
      const { owner_id: ownerId } = await req.postgresClient.getProjectOwner(projectId);
      if (ownerId === userId) {
        await req.postgresClient.deleteProject(userId, projectId);
        return res.status(200).send({ message: 'Project deleted' });
      }
      return res.status(400).send({ message: 'Bad request' });
    } catch (err) {
      req.logger.error({ error: JSON.stringify(err) });
      return res.status(500).send({ message: 'Server error' });
    }
  }
  return res.status(400).send({ message: 'Supply a projectId' });
};

module.exports = deleteProject;
