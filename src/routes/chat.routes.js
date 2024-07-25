import express from "express";
import { saveMessage, getMessages } from "../controllers/chat.controllers.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { senderId, receiverId, message, isSender } = req.body;
  try {
    const chatMessage = await saveMessage(
      senderId,
      receiverId,
      message,
      isSender,
    );
    res.status(201).json(chatMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  const { userId1, userId2 } = req.query;
  try {
    const messages = await getMessages(userId1, userId2);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
