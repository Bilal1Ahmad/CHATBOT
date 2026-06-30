import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function App() {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      title: "Welcome Chat",
      messages: [
        {
          text: "Hello! How can I help you today?",
          sender: "assistant",
          timestamp: new Date(),
        },
      ],
    },
  ]);

  const [currentConversationId, setCurrentConversationId] = useState(1);

  const currentConversation = conversations.find(
    (conv) => conv.id === currentConversationId
  );

  const setMessages = (updater) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) => {
        if (conv.id !== currentConversationId) return conv;

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

  const updateConversationTitle = (firstMessage) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id !== currentConversationId) return conv;

        if (
          conv.title === "Welcome Chat" ||
          conv.title.startsWith("Chat ")
        ) {
          return {
            ...conv,
            title:
              firstMessage.length > 30
                ? firstMessage.substring(0, 30) + "..."
                : firstMessage,
          };
        }

        return conv;
      })
    );
  };

  const createNewConversation = () => {
    const newId =
      conversations.length > 0
        ? Math.max(...conversations.map((c) => c.id)) + 1
        : 1;

    const newConversation = {
      id: newId,
      title: `Chat ${newId}`,
      messages: [],
    };

    setConversations([...conversations, newConversation]);
    setCurrentConversationId(newId);
  };

  const deleteConversation = (id) => {
    const filtered = conversations.filter((c) => c.id !== id);

    setConversations(filtered);

    if (currentConversationId === id && filtered.length > 0) {
      setCurrentConversationId(filtered[0].id);
    }
  };

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
          messages={currentConversation.messages}
          setMessages={setMessages}
          updateConversationTitle={updateConversationTitle}
        />
      )}
    </div>
  );
}

export default App;