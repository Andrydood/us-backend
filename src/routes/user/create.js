const _ = require('lodash');
const { hashPassword } = require('../../lib/authentication');
const { createUserSchema } = require('../../lib/joiSchemas');

const create = async (req, res) => {
  const userData = _.pick(
    req.body, [
      'email',
      'username',
      'password',
      'bio',
      'locationId',
      'skillIds',
    ],
  );

  const { password, skillIds } = req.body;

  try {
    await createUserSchema.validateAsync(userData);
  } catch (err) {
    return res.status(400).send({ message: 'Bad request' });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const { id: userId } = await req.postgresClient.createUser({ ...userData, hashedPassword });
    if (skillIds) {
      await req.postgresClient.addUserSkills(userId, skillIds);
    }
    return res.status(201).send({ id: userId });
  } catch (err) {
    const { constraint } = err;

    switch (constraint) {
      case 'users_username_key':
        return res.status(409).send({ message: 'That username is already taken' });
      case 'users_email_key':
        return res.status(409).send({ message: 'That email is already taken' });
      default:
        req.logger.error({ error: JSON.stringify(err) });
        return res.status(500).send({ message: 'Server error' });
    }
  }
};

module.exports = create;
