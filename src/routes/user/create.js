const _ = require('lodash');
const { hashPassword } = require('../../lib/authentication');
const { createUserSchema } = require('../../lib/joiSchemas');

const create = async (req, res) => {
  const userData = _.pick(
    req.body, [
      'email',
      'username',
      'password',
      'firstName',
      'lastName',
      'bio',
      'locationId',
      'skillIds',
    ],
  );

  const { password, skillIds } = req.body;

  try {
    await createUserSchema.validateAsync(userData);
    const hashedPassword = await hashPassword(password);
    const { id: userId } = await req.postgresClient.createUser({ ...userData, hashedPassword });
    if (skillIds) {
      await req.postgresClient.addUserSkills(userId, skillIds);
    }
    res.status(201).send({ id: userId });
  } catch (err) {
    req.logger.error(err);
    const { constraint } = err;
    res.status(400).send({ message: 'Invalid data', constraint });
  }
};

module.exports = create;
