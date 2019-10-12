const profile = async (req, res) => {
  const { username } = req.params;
  if (username) {
    try {
      const page = req.query.page || 0;
      const dbResponse = await req.postgresClient.getProjectsByOwner(username, page);
      res.status(200).send(dbResponse);
    } catch (err) {
      req.logger.error(err);
      res.status(400).send('Error getting profile');
    }
  }
  res.status(400).send('Username not provided');
};

module.exports = profile;
