const { generateAuthToken } = require('../../lib/authentication');

const refresh = async (req, res) => {
  try {
    const { username, id } = req.auth;
    const token = generateAuthToken(username, id);
    return res.status(200).send({ token });
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = refresh;
