import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

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

    const contents = [
      {
        role: "user",
        parts: [
          {
            text:
              "You are Bilal's AI assistant. " +
              "Always reply politely, accurately, and in well-formatted Markdown. " +
              "If asked programming questions, explain with examples. " +
              "If you don't know something, honestly say so.",
          },
        ],
      },
    ];

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

    res.status(500).json({
      success: false,
      error: err.message || "Something went wrong.",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});