import { Chat } from "../models/chat.models.js";

const saveMessage = async (senderId, receiverId, message) => {
  const chatMessage = new Chat({
    sender: senderId,
    receiver: receiverId,
    message,
  });
  await chatMessage.save();
  return chatMessage;
};

const getMessages = async (userId1, userId2) => {
  const messages = await Chat.find({
    $or: [
      { sender: userId1, receiver: userId2 },
      { sender: userId2, receiver: userId1 },
    ],
  }).sort({ createdAt: 1 });
  return messages;
};

export { saveMessage, getMessages };
