import express from "express";
import { getMessages } from "../controllers/chat.controllers.js";
import mongoose from "mongoose";

const router = express.Router();

router.get("/:userId1/:userId2", async (req, res) => {
  const { userId1, userId2 } = req.params;

  // Validate user IDs
  if (
    !mongoose.Types.ObjectId.isValid(userId1) ||
    !mongoose.Types.ObjectId.isValid(userId2)
  ) {
    return res.status(400).json({ error: "Invalid user ID format." });
  }

  try {
    const messages = await getMessages(userId1, userId2);
    res.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
