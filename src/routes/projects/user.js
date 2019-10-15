const getUserProjects = async (req, res) => {
  const { username } = req.params;
  if (username) {
    try {
      const page = req.query.page || 0;
      const dbResponse = await req.postgresClient.getUserProjects(username, page);
      res.status(200).send(dbResponse);
    } catch (err) {
      req.logger.error(err);
      res.status(400).send({ message: 'Error getting projects' });
    }
  }
  res.status(400).send({ message: 'Supply a username' });
};

module.exports = getUserProjects;
