import Message from "./Message";
import { useState, useRef, useEffect } from "react";

function ChatWindow({ messages, onSendMessage }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;

    // Send user message
    onSendMessage(input, "user");

    // Simulate bot response after a short delay
    setTimeout(() => {
      const responses = [
        "That's interesting! Tell me more.",
        "I see. How can I help you with that?",
        "Great question! Let me think about that.",
        "Absolutely! I understand.",
        "That makes sense. What would you like to do next?",
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      onSendMessage(randomResponse, "bot");
    }, 1000);

    setInput("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👋</div>
            <h2>Start a conversation!</h2>
            <p>Type a message to begin</p>
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
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="input-area">
        <div className="input-wrapper">
          <textarea
            className="message-input"
            placeholder="Type a message... (Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="1"
          />
          <button className="send-btn" onClick={sendMessage} title="Send message">
            📤 Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;