const _ = require('lodash');
const { createProjectSchema } = require('../../lib/joiSchemas');

const create = async (req, res) => {
  const projectData = _.pick(
    req.body, [
      'name',
      'description',
      'locationId',
      'inspiredBy',
      'assets',
      'contact',
      'skillsNeeded',
    ],
  );

  const { skillsNeeded } = req.body;


  try {
    await createProjectSchema.validateAsync(projectData);
  } catch (err) {
    return res.status(400).send({ message: 'Bad request' });
  }

  try {
    const { id: ownerId } = req.auth;
    const { id: projectId } = await req.postgresClient.createProject({ ownerId, ...projectData });
    if (skillsNeeded) {
      await req.postgresClient.addProjectSkills(projectId, skillsNeeded);
    }
    return res.status(201).send({ id: projectId });
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = create;
