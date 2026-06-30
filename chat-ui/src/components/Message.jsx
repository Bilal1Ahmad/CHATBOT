import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function Message({ text, sender, timestamp }) {
  const formatTime = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyMessage = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`message-wrapper ${sender}`}>
      <div className={`message ${sender}`}>
        {sender === "assistant" ? (
          <>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");

                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {text}
            </ReactMarkdown>

            <button
              className="copy-btn"
              onClick={copyMessage}
            >
              📋 Copy
            </button>
          </>
        ) : (
          <p>{text}</p>
        )}

        {timestamp && (
          <span className="timestamp">
            {formatTime(timestamp)}
          </span>
        )}
      </div>
    </div>
  );
}

export default Message;