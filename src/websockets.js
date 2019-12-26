const PostgresClient = require('./lib/postgresClient');
const { verifyAuthToken } = require('./lib/authentication');

const postgresClient = new PostgresClient();

const openConversations = {};
const onlineUsers = {};

const chat = (client) => {
  let userData = {};

  const leaveChatRoom = () => {
    if (userData.currentChatRoomId) {
      openConversations[userData.currentChatRoomId].onlineUsers -= 1;

      if (openConversations[userData.currentChatRoomId].onlineUsers === 0) {
        delete openConversations[userData.currentChatRoomId];
      }

      userData.currentChatRoomId = null;
    }
  };

  client.on('allowEvents', ({ token }) => {
    const { id: userId, username } = verifyAuthToken(token);
    userData = {
      userId,
      username,
      client,
      currentChatRoomId: null,
    };
    onlineUsers[userId] = userData;
  });

  client.on('joinChatRoom', async ({ token, conversationId }) => {
    const { id: userId } = verifyAuthToken(token);

    try {
      const {
        owner_id: ownerId,
        interested_user_id: interestedUserId,
      } = await postgresClient.getConversationParticipants(conversationId);

      if (userId !== ownerId && userId !== interestedUserId) {
        return client.close();
      }

      if (!openConversations[conversationId]) {
        openConversations[conversationId] = {
          partecipantsIds: [interestedUserId, ownerId],
          onlineUsers: 0,
        };
      }
      openConversations[conversationId].onlineUsers += 1;

      userData.currentChatRoomId = conversationId;
    } catch (err) {
      console.log(err);
    }
  });

  client.on('leaveChatRoom', () => {
    leaveChatRoom();
  });

  client.on('disconnect', () => {
    const { userId } = userData;

    leaveChatRoom();

    delete onlineUsers[userId];
  });

  client.on('message', async (message) => {
    try {
      const { currentChatRoomId, userId, username } = userData;

      await postgresClient.updateConversationTime(currentChatRoomId);
      const id = await postgresClient.sendMessage(currentChatRoomId, userId, message);

      const broadcastedMessage = {
        username,
        content: message,
        createdAt: new Date(),
        read: false,
        id,
      };

      const { partecipantsIds } = openConversations[currentChatRoomId];
      partecipantsIds.forEach((partecipantId) => {
        if (onlineUsers[partecipantId]) {
          onlineUsers[partecipantId].client.emit('broadcastMessage', { conversationId: currentChatRoomId, message: broadcastedMessage });
        }
      });
    } catch (err) {
      console.log(err);
    }
  });

  client.on('markAsRead', async (data) => {
    try {
      const { messageId, token, conversationId } = data;
      const { id: userId } = verifyAuthToken(token);

      const {
        owner_id: ownerId,
        interested_user_id: interestedUserId,
      } = await postgresClient.getConversationParticipants(conversationId);
      if ((userId === ownerId) || (userId === interestedUserId)) {
        postgresClient.markMessageAsRead(messageId);
      }
    } catch (err) {
      console.log(err);
    }
  });
};

module.exports = chat;
