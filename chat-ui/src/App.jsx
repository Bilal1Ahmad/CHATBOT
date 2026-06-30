import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/conversations`);
      const data = await response.json();

      setConversations(data);

      if (data.length > 0) {
        setCurrentConversationId(data[0]._id);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentConversation = conversations.find(
    (conv) => conv._id === currentConversationId
  );

  const setMessages = (updater) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv._id !== currentConversationId) return conv;

        const updatedMessages =
          typeof updater === "function"
            ? updater(conv.messages)
            : updater;

        return {
          ...conv,
          messages: updatedMessages,
        };
      })
    );
  };

  const updateConversationTitle = (title) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv._id !== currentConversationId) return conv;

        return {
          ...conv,
          title,
        };
      })
    );
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch(`${API_URL}/api/conversations`, {
        method: "POST",
      });

      const conversation = await response.json();

      setConversations((prev) => [conversation, ...prev]);

      setCurrentConversationId(conversation._id);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const deleteConversation = async (id) => {
    try {
      await fetch(`${API_URL}/api/conversations/${id}`, {
        method: "DELETE",
      });

      const updated = conversations.filter((c) => c._id !== id);

      setConversations(updated);

      if (updated.length > 0) {
        setCurrentConversationId(updated[0]._id);
      } else {
        setCurrentConversationId(null);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <h2>Loading conversations...</h2>
      </div>
    );
  }

  return (
    <div className="App">
      <Sidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={setCurrentConversationId}
        onNewConversation={createNewConversation}
        onDeleteConversation={deleteConversation}
      />

      {currentConversation && (
        <ChatWindow
          currentConversationId={currentConversationId}
          messages={currentConversation.messages}
          setMessages={setMessages}
          updateConversationTitle={updateConversationTitle}
        />
      )}
    </div>
  );
}

export default App;