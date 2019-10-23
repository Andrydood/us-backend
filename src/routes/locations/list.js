const list = async (req, res) => {
  try {
    const dbResponse = await req.postgresClient.getAllLocations();
    return res.status(200).send({ locations: dbResponse });
  } catch (err) {
    req.logger.error(err);
    return res.status(400).send({ message: 'Error getting locations' });
  }
};

module.exports = list;
