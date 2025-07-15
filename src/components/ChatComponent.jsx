// ChatComponent.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./ChatComponent.css";

const ChatComponent = () => {
  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = {
      type: "user",
      content: question,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const response = await axios.post(`${apiBaseUrl}/api/ask`, {
        question,
      });
      const aiMessage = {
        type: "assistant",
        content: response.data.answer,
        timestamp: new Date(),
      };
      setChatHistory((prev) => [...prev, aiMessage]);
    } catch (err) {
      setChatHistory((prev) => [
        ...prev,
        {
          type: "error",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setChatHistory([]);
    setIsLoading(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className={`chat-app ${darkMode ? "dark" : "light"}`}>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <div className="title-with-icon">
            <img src="/morpankh.png" alt="Morpankh" className="morpankh-icon" />
            <h2 className="mb-0">Madhava - Ask Shree Krishna</h2>
          </div>
          <div>
            <button
              className="btn btn-outline-light btn-sm me-2"
              onClick={() => setDarkMode(!darkMode)}
              title="Toggle theme"
            >
              <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>
            {chatHistory.length > 0 && (
              <button
                className="btn btn-outline-light btn-sm"
                onClick={clearChat}
                title="Clear chat"
              >
                <i className="fas fa-trash"></i>
              </button>
            )}
          </div>
        </div>

        <div className="card-body chat-container">
          <div className="messages-container">
            {chatHistory.length === 0 && (
              <div className="welcome-message">
                <h4>Welcome to Madhava</h4>
                <p>
                  Lost in life’s chaos? Let Lord Shree Krishna guide your path.
                </p>
                <ul className="example-questions">
                  <li onClick={() => setQuestion("Why is life full of struggles?")}>"Why is life full of struggles?"</li>
                  <li onClick={() => setQuestion("How can I find peace within?")}>"How can I find peace within?"</li>
                  <li onClick={() => setQuestion("What does Shree Krishna say about letting go?")}>"What does Shree Krishna say about letting go?"</li>
                </ul>
              </div>
            )}

            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.content.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}<br />
                    </React.Fragment>
                  ))}
                </div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            ))}

            {isLoading && (
              <div className="message assistant">
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="card-footer">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <textarea
                className="form-control"
                placeholder="Ask your question..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                rows="2"
                disabled={isLoading}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!question.trim() || isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Thinking...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane me-2"></i>Ask
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
