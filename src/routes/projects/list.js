const list = async (req, res) => {
  try {
    const page = req.query.page || 0;
    const projectList = await req.postgresClient.getAllProjects(page);
    res.status(200).send(projectList);
  } catch (err) {
    req.logger.error(err);
    res.status(400).send({ message: 'Error getting projects' });
  }
};

module.exports = list;
