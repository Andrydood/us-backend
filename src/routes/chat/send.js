const _ = require('lodash');
const { sendMessageSchema } = require('../../lib/joiSchemas');

const send = async (req, res) => {
  const chatData = _.pick(
    req.body, [
      'conversationId',
      'message',
    ],
  );

  const { conversationId, message } = req.body;

  try {
    await sendMessageSchema.validateAsync(chatData);
  } catch (err) {
    return res.status(400).send({ message: 'Bad request' });
  }

  try {
    const { id: userId } = req.auth;

    const {
      owner_id: ownerId,
      interested_user_id: interestedUserId,
    } = await req.postgresClient.getConversationParticipants(conversationId);

    if (userId !== ownerId && userId !== interestedUserId) {
      return res.status(400).send({ message: 'Not authorised to send message' });
    }

    await req.postgresClient.updateConversationTime(conversationId);
    await req.postgresClient.sendMessage(conversationId, userId, message);
    return res.status(201).send('Message Sent');
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = send;
