const { createProjectSchema } = require('../../lib/joiSchemas');

const create = async (req, res) => {
  const { name, description } = req.body;
  const projectData = { name, description };
  try {
    await createProjectSchema.validateAsync(projectData);
    const { username } = req.auth;
    const pgResponse = await req.postgresClient.createProject(username, name, description);
    res.status(201).send(pgResponse);
  } catch (err) {
    req.logger.error(err);
    res.status(400).send('Invalid data');
  }
};

module.exports = create;
