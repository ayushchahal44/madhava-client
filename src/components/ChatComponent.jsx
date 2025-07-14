import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ChatComponent.css';

const ChatComponent = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedVerse, setSelectedVerse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    const userQuestion = question;
    setQuestion('');
    const userMessage = {
      type: 'user',
      content: userQuestion,
      timestamp: new Date()
    };
    setChatHistory(prev => [...prev, userMessage]);

    try {
      // Call the backend API to get AI response based on Gita verses
      const response = await axios.post('http://localhost:5000/api/ask', { 
        question: userQuestion 
      });
      
      const aiResponse = response.data.answer;

      // Add AI response to chat history
      const aiMessage = {
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, aiMessage]);
      setAnswer(aiResponse);

    } catch (error) {
      console.error('Error getting response:', error);
      const errorMessage = {
        type: 'error',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const clearChat = () => {
    setChatHistory([]);
    setAnswer('');
    setSelectedVerse(null);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-0">
                    <i className="fas fa-om me-2"></i>
                    Madhava - Bhagavad Gita Q&A
                  </h2>
                  <small>Ask questions and get answers based on the wisdom of the Bhagavad Gita</small>
                </div>
                <button 
                  className="btn btn-outline-light btn-sm" 
                  onClick={clearChat}
                  title="Clear chat history"
                >
                  <i className="fas fa-trash"></i> Clear
                </button>
              </div>
            </div>

            <div className="card-body chat-container">
              <div className="messages-container">
                {chatHistory.length === 0 && (
                  <div className="welcome-message text-center">
                    <div className="mb-3">
                      <i className="fas fa-om fa-3x text-primary"></i>
                    </div>
                    <h4>Welcome to Madhava</h4>
                    <p className="text-muted">
                      Ask me questions about life, dharma, karma, or any spiritual inquiry, 
                      and I'll provide answers based on the wisdom of the Bhagavad Gita.
                    </p>
                    <div className="example-questions">
                      <small className="text-muted">Try asking:</small>
                      <ul className="list-unstyled">
                        <li><small>"What is karma yoga?"</small></li>
                        <li><small>"How should I deal with difficult situations?"</small></li>
                        <li><small>"What does Krishna say about duty?"</small></li>
                      </ul>
                    </div>
                  </div>
                )}

                {chatHistory.map((message, index) => (
                  <div key={index} className={`message ${message.type}`}>
                    <div className="message-content">
                      {message.content.split('\n').map((line, idx) => (
                        <React.Fragment key={idx}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="message-time">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="message assistant">
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-footer">
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <textarea
                    className="form-control"
                    placeholder="Ask your question about the Bhagavad Gita..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows="3"
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
                        <i className="fas fa-paper-plane me-2"></i>
                        Ask
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent; 