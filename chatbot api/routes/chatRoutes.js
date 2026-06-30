import express from "express";

import {
  getConversations,
  createConversation,
  deleteConversation,
  chatWithGemini,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/conversations", getConversations);

router.post("/conversations", createConversation);

router.delete("/conversations/:id", deleteConversation);

router.post("/chat", chatWithGemini);

export default router;