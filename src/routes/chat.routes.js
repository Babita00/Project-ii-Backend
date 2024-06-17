import express from "express";
import { getMessages } from "../controllers/chat.controllers.js";

const router = express.Router();

router.get("/:userId1/:userId2", async (req, res) => {
  const { userId1, userId2 } = req.params;
  const messages = await getMessages(userId1, userId2);
  res.json(messages);
});

export default router;
