const _ = require('lodash');
const { generateAuthToken, checkPassword } = require('../../lib/authentication');
const { loginUserSchema } = require('../../lib/joiSchemas');

const login = async (req, res) => {
  const userData = _.pick(
    req.body, [
      'email',
      'password',
    ],
  );
  const { email, password } = req.body;

  try {
    await loginUserSchema.validateAsync(userData);
  } catch (err) {
    return res.status(400).send({ message: 'Bad request' });
  }

  try {
    const {
      username,
      passwordhash,
      id,
    } = await req.postgresClient.getUserCredentialsByEmail(email);
    const passwordIsCorrect = await checkPassword(password, passwordhash);
    if (passwordIsCorrect) {
      const token = generateAuthToken(username, id);
      return res.status(200).send({ token });
    }
    return res.status(400).send({ message: 'Incorrect password' });
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = login;
