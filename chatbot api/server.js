import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

import connectDB from "./config/db.js";
// import Conversation from "./models/Conversation.js"; // Uncomment when you start using MongoDB CRUD

dotenv.config();

// Connect MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
});

app.post("/api", async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    // System prompt
    const contents = [
      {
        role: "user",
        parts: [
          {
            text:
              "You are Bilal's AI assistant. " +
              "Always reply politely, accurately, and in Markdown. " +
              "If asked programming questions, explain with examples. " +
              "If you don't know something, honestly say so.",
          },
        ],
      },
    ];

    // Conversation history
    history.forEach((msg) => {
      contents.push({
        role: msg.sender === "assistant" ? "model" : "user",
        parts: [
          {
            text: msg.text,
          },
        ],
      });
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    res.json({
      success: true,
      reply: response.text,
    });
  } catch (err) {
    console.error("Gemini Error:", err);

    // Better error handling
    if (err.status === 503) {
      return res.status(503).json({
        success: false,
        error: "Gemini is busy. Please try again in a few seconds.",
      });
    }

    res.status(500).json({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});