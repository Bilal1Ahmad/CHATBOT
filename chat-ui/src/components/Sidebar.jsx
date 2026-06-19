import { useState } from 'react';

function Sidebar({ conversations, currentConversationId, onSelectConversation, onNewConversation, onDeleteConversation }) {
    const [hoveredId, setHoveredId] = useState(null);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1>💬 EDITH AI Assistant</h1>
                <button className="new-chat-btn" onClick={onNewConversation} title="New Chat">
                    ✨ New Chat
                </button>
            </div>
            
            <div className="conversations-list">
                {conversations.length === 0 ? (
                    <div className="no-conversations">No conversations yet</div>
                ) : (
                    conversations.map(conv => (
                        <div
                            key={conv.id}
                            className={`conversation-item ${currentConversationId === conv.id ? 'active' : ''}`}
                            onClick={() => onSelectConversation(conv.id)}
                            onMouseEnter={() => setHoveredId(conv.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            <div className="conversation-title">
                                {conv.title}
                                <span className="message-count">({conv.messages.length})</span>
                            </div>
                            {hoveredId === conv.id && (
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDeleteConversation(conv.id);
                                    }}
                                    title="Delete conversation"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <div className="sidebar-footer">
                <div className="info-text">Interactive Chat UI</div>
            </div>
        </div>
    );
}

export default Sidebar;