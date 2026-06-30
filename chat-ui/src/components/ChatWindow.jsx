import Message from "./Message";
import { useState, useRef, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function ChatWindow({
  currentConversationId,
  messages,
  setMessages,
  updateConversationTitle,
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const currentInput = input.trim();

    if (messages.length === 0) {
      updateConversationTitle(currentInput);
    }

    const userMessage = {
      text: currentInput,
      sender: "user",
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: currentConversationId,
          message: currentInput,
          history: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Server Error");
      }

      const assistantMessage = {
        text: data.reply,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          text: error.message || "Unable to connect to AI.",
          sender: "assistant",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h2>Start a conversation</h2>
            <p>Ask me anything...</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <Message
                key={index}
                text={msg.text}
                sender={msg.sender}
                timestamp={msg.timestamp}
              />
            ))}

            {loading && (
              <div className="loading-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            className="message-input"
            placeholder="Type your message..."
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />

          <button
            className="send-btn"
            disabled={loading || !input.trim()}
            onClick={sendMessage}
          >
            {loading ? "Thinking..." : "📤 Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;