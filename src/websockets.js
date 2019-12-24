const PostgresClient = require('./lib/postgresClient');

const postgresClient = new PostgresClient();

const onlineUsers = {};
const chat = (client) => {
  let userData = {};

  client.on('joinChatRoom', async ({ userId, username, conversationId }) => {
    const {
      owner_id: ownerId,
      interested_user_id: interestedUserId,
    } = await postgresClient.getConversationParticipants(conversationId);

    if (userId !== ownerId && userId !== interestedUserId) {
      return client.close();
    }

    const data = {
      userId,
      username,
      client,
      conversationId,
    };

    if (!onlineUsers[conversationId]) {
      onlineUsers[conversationId] = [];
    }
    onlineUsers[conversationId].push(data);
    userData = data;
  });

  client.on('disconnect', () => {
    const { conversationId } = userData;
    const index = onlineUsers[conversationId] && onlineUsers[conversationId].indexOf(userData);

    if (index >= 0) {
      onlineUsers[conversationId].splice(index, 1);
      if (onlineUsers[conversationId].length === 0) {
        delete onlineUsers[conversationId];
      }
    }
  });

  client.on('message', async (message) => {
    const { conversationId, userId, username } = userData;

    await postgresClient.updateConversationTime(conversationId);
    await postgresClient.sendMessage(conversationId, userId, message);

    const broadcastedMessage = {
      username,
      content: message,
      created_at: new Date(),
    };

    onlineUsers[conversationId].map((user) => user.client.emit('broadcastMessage', broadcastedMessage));
  });
};

module.exports = chat;
