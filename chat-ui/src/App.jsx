import { useState } from 'react';
import Sidebar from './components/Sidebar'
import './App.css'
import ChatWindow from './components/ChatWindow';

function App() {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Welcome Chat', messages: [{ text: 'Hello! How can I help?', sender: 'bot', timestamp: new Date() }] },
  ]);
  const [currentConversationId, setCurrentConversationId] = useState(1);

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  const addMessage = (text, sender) => {
    setConversations(conversations.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, { text, sender, timestamp: new Date() }]
        };
      }
      return conv;
    }));
  };

  const createNewConversation = () => {
    const newId = Math.max(...conversations.map(c => c.id), 0) + 1;
    const newConversation = { id: newId, title: `Chat ${newId}`, messages: [] };
    setConversations([...conversations, newConversation]);
    setCurrentConversationId(newId);
  };

  const deleteConversation = (id) => {
    const filtered = conversations.filter(c => c.id !== id);
    setConversations(filtered);
    if (currentConversationId === id && filtered.length > 0) {
      setCurrentConversationId(filtered[0].id);
    }
  };
  
  return (
   <div className='App'>
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
        onSendMessage={addMessage}
      />
    )}
   </div>
  )
}

export default App;