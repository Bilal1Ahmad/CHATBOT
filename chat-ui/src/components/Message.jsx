function Message({ text, sender, timestamp }) {
    const formatTime = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className={`message-wrapper ${sender}`}>
            <div className={`message ${sender}`}>
                <p>{text}</p>
                {timestamp && <span className="timestamp">{formatTime(timestamp)}</span>}
            </div>
        </div>
    );
}

export default Message;