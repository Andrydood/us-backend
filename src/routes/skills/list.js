const list = async (req, res) => {
  try {
    const dbResponse = await req.postgresClient.getAllSkills();
    if (dbResponse) {
      return res.status(200).send({ skills: dbResponse });
    }
    return res.status(400).send({ message: 'Not found' });
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = list;
