const { hashPassword } = require('../../lib/authentication');
const { createUserSchema } = require('../../lib/joiSchemas');

const create = async (req, res) => {
  const { email, username, password } = req.body;
  const userData = { email, username, password };
  try {
    await createUserSchema.validateAsync(userData);
    const hashedPassword = await hashPassword(password);
    const dbResponse = await req.postgresClient.insertUser(email, username, hashedPassword);
    res.status(201).send(dbResponse);
  } catch (err) {
    req.logger.error(err);
    res.status(400).send('Invalid data');
  }
};

module.exports = create;
