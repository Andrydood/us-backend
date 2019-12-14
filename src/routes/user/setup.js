const _ = require('lodash');

const { generateAuthToken } = require('../../lib/authentication');
const { setupSchema } = require('../../lib/joiSchemas');

const setup = async (req, res) => {
  const bodyData = _.pick(
    req.body, [
      'bio',
      'location',
      'skillIds',
    ],
  );

  const { bio, location, skillIds } = req.body;

  try {
    await setupSchema.validateAsync(bodyData);
  } catch (err) {
    return res.status(400).send({ message: 'Bad request' });
  }

  try {
    const { username, id: userId } = req.auth;

    if (skillIds) {
      await req.postgresClient.addUserSkills(userId, skillIds);
    }

    await req.postgresClient.setupUser({
      bio,
      location,
      userId,
    });

    const token = generateAuthToken(username, userId, true);
    return res.status(200).send({ token });
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = setup;
