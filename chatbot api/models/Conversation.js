import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const conversationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: "New Chat",
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Conversation", conversationSchema);