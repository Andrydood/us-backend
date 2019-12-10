const camelCaseKeys = require('camelcase-keys');

const otherProjects = async (req, res) => {
  const { id: userId } = req.auth;

  try {
    const dbResponse = await req.postgresClient.getConversationsByInterestedUser(userId);
    return res.status(200).send(camelCaseKeys(dbResponse));
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = otherProjects;
