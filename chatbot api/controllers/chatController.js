import { GoogleGenAI } from "@google/genai";
import Conversation from "../models/Conversation.js";


// Get all conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({
      updatedAt: -1,
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Create new conversation
export const createConversation = async (req, res) => {
  try {
    const conversation = await Conversation.create({
      title: "New Chat",
      messages: [],
    });

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Delete conversation
export const deleteConversation = async (req, res) => {
  try {
    await Conversation.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Chat with Gemini
export const chatWithGemini = async (req, res) => {
  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
    const { conversationId, message, history = [] } = req.body;

    const contents = history.map((msg) => ({
      role: msg.sender === "assistant" ? "model" : "user",
      parts: [{ text: msg.text }],
    }));

    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    const assistantReply = response.text;

    const conversation = await Conversation.findById(conversationId);

    if (conversation) {
      if (
        conversation.title === "New Chat" &&
        conversation.messages.length === 0
      ) {
        conversation.title =
          message.length > 30
            ? message.substring(0, 30) + "..."
            : message;
      }

      conversation.messages.push({
        text: message,
        sender: "user",
      });

      conversation.messages.push({
        text: assistantReply,
        sender: "assistant",
      });

      await conversation.save();
    }

    res.json({
      success: true,
      reply: assistantReply,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};