const profile = async (req, res) => {
  const { username } = req.params;
  if (username) {
    try {
      const dbResponse = await req.postgresClient.getUserDataByUsername(username);
      res.status(200).send(dbResponse);
    } catch (err) {
      req.logger.error(err);
      res.status(400).send({ message: 'Error getting profile' });
    }
  }
  res.status(400).send({ message: 'Username not provided' });
};

module.exports = profile;
