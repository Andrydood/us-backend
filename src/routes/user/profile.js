const camelCaseKeys = require('camelcase-keys');

const profile = async (req, res) => {
  const { username } = req.params;
  if (username) {
    try {
      const dbResponse = await req.postgresClient.getUserDataByUsername(username);
      if (dbResponse) {
        return res.status(200).send(camelCaseKeys(dbResponse));
      }
      return res.status(400).send({ message: 'Not found' });
    } catch (err) {
      req.logger.error({ error: JSON.stringify(err) });
      return res.status(500).send({ message: 'Server error' });
    }
  }
  return res.status(400).send({ message: 'Username not provided' });
};

module.exports = profile;
