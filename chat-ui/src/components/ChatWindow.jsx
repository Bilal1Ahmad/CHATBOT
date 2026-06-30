import Message from "./Message";
import { useState, useRef, useEffect } from "react";

function ChatWindow({
  messages,
  setMessages,
  updateConversationTitle,
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentInput,
            history: updatedMessages,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Server Error");
      }

      const data = await response.json();

      const botMessage = {
        text: data.reply,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          text: "❌ Unable to connect to AI server.",
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

            <div ref={messagesEndRef}></div>
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
            onClick={sendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "📤 Send"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;