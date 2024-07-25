import { Chat } from "../models/chat.models.js";
import { Conversation } from "../models/conversation.models.js";

const saveMessage = async (senderId, receiverId, message, isSender) => {
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, receiverId],
      });
      await conversation.save();
    }

    const chatMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      message,
      conversation: conversation._id,
      isSender,
    });

    await chatMessage.save();

    return chatMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};

const getMessages = async (userId1, userId2) => {
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] },
    });

    if (!conversation) {
      return [];
    }

    const messages = await Chat.find({ conversation: conversation._id }).sort({
      createdAt: 1,
    });
    return messages;
  } catch (error) {
    console.error("Error retrieving messages:", error);
    throw error;
  }
};

export { saveMessage, getMessages };
