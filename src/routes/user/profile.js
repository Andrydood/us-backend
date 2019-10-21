const camelCaseKeys = require('camelcase-keys');

const profile = async (req, res) => {
  const { username } = req.params;
  if (username) {
    try {
      const dbResponse = await req.postgresClient.getUserDataByUsername(username);
      return res.status(200).send(camelCaseKeys(dbResponse));
    } catch (err) {
      req.logger.error(err);
      return res.status(400).send({ message: 'Error getting profile' });
    }
  }
  return res.status(400).send({ message: 'Username not provided' });
};

module.exports = profile;
