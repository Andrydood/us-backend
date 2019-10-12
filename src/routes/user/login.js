const { generateAuthToken, checkPassword } = require('../../lib/authentication');
const { loginUserSchema } = require('../../lib/joiSchemas');

const login = async (req, res) => {
  const { email, password } = req.body;
  const userData = { email, password };
  try {
    await loginUserSchema.validateAsync(userData);
    const { username, passwordhash } = await req.postgresClient.getUserByEmail(email);
    const passwordIsCorrect = await checkPassword(password, passwordhash);
    if (passwordIsCorrect) {
      const token = generateAuthToken(username);
      res.status(200).send({ token });
    } else {
      res.status(403).send('Incorrect Password');
    }
  } catch (err) {
    req.logger.error(err);
    res.status(400).send('Invalid data');
  }
};

module.exports = login;
