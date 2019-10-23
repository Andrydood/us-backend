const list = async (req, res) => {
  try {
    const dbResponse = await req.postgresClient.getAllSkills();
    return res.status(200).send({ skills: dbResponse });
  } catch (err) {
    req.logger.error(err);
    return res.status(400).send({ message: 'Error getting skills' });
  }
};

module.exports = list;
