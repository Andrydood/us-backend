const _ = require('lodash');
const { createChatSchema } = require('../../lib/joiSchemas');

const create = async (req, res) => {
  const chatData = _.pick(
    req.body, [
      'projectId',
    ],
  );

  const { projectId } = req.body;

  try {
    await createChatSchema.validateAsync(chatData);
  } catch (err) {
    return res.status(400).send({ message: 'Bad request' });
  }

  try {
    const { id: userId } = req.auth;

    const conversationId = await req.postgresClient.findConversationId(
      userId,
      projectId,
    );

    if (conversationId) {
      return res.status(200).send({ conversationId });
    }

    const newConversationId = await req.postgresClient.createConversation(
      userId,
      projectId,
    );

    return res.status(201).send({ conversationId: newConversationId });
  } catch (err) {
    req.logger.error({ error: JSON.stringify(err) });
    return res.status(500).send({ message: 'Server error' });
  }
};

module.exports = create;
