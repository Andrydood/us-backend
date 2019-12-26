const camelCaseKeys = require('camelcase-keys');

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

    const messages = await req.postgresClient.getConversation(conversationId);
    const conversationDetails = await req.postgresClient.getConversationDetails(conversationId);
    if (userId === ownerId) {
      conversationDetails.isOwner = true;
    } else {
      conversationDetails.isOwner = false;
    }
    return res.status(201).send(camelCaseKeys({ messages, conversationDetails }, { deep: true }));
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = conversation;
