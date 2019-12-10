const conversation = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const { id: userId } = req.auth;

    const {
      owner_id: ownerId,
      interested_user_id: interestedUserId,
    } = await req.postgresClient.getConversationParticipants(conversationId);

    if (userId !== ownerId && userId !== interestedUserId) {
      return res.status(400).send({ message: 'Not authorised to see messages' });
    }

    const conversationContents = await req.postgresClient.getConversation(conversationId);

    return res.status(201).send(conversationContents);
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = conversation;
