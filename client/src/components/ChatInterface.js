import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 800px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 20px rgba(0,0,0,0.1);

  @media (max-width: 768px) {
    height: 100vh;
    max-width: 100%;
    box-shadow: none;
  }
`;

const Header = styled.div`
  background: #2c3e50;
  color: white;
  padding: 1rem;
  text-align: center;
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  p {
    margin: 0.5rem 0 0 0;
    opacity: 0.8;
    font-size: 0.9rem;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Message = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  
  .bubble {
    max-width: 70%;
    padding: 0.75rem 1rem;
    border-radius: 18px;
    background: ${props => props.isUser ? '#007bff' : '#e9ecef'};
    color: ${props => props.isUser ? 'white' : '#333'};
    word-wrap: break-word;
    
    @media (max-width: 768px) {
      max-width: 85%;
    }
  }
`;

const JsonDisplay = styled.pre`
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
  overflow-x: auto;
  white-space: pre-wrap;
  margin: 0.5rem 0;
  max-height: 400px;
  overflow-y: auto;
`;

const InputContainer = styled.div`
  padding: 1rem;
  border-top: 1px solid #dee2e6;
  background: white;
  
  @media (max-width: 768px) {
    padding: 1rem;
    position: sticky;
    bottom: 0;
  }
`;

const InputForm = styled.form`
  display: flex;
  gap: 0.5rem;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #dee2e6;
  border-radius: 25px;
  outline: none;
  font-size: 1rem;
  
  &:focus {
    border-color: #007bff;
  }
`;

const SendButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 1rem;
  min-width: 80px;
  
  &:hover:not(:disabled) {
    background: #0056b3;
  }
  
  &:disabled {
    background: #6c757d;
    cursor: not-allowed;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  justify-content: flex-start;
  
  .bubble {
    background: #e9ecef;
    padding: 0.75rem 1rem;
    border-radius: 18px;
    
    .dots {
      display: flex;
      gap: 4px;
      
      span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #6c757d;
        animation: typing 1.4s infinite;
        
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }
  
  @keyframes typing {
    0%, 60%, 100% {
      transform: translateY(0);
    }
    30% {
      transform: translateY(-10px);
    }
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const QuickActionButton = styled.button`
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #495057;
  
  &:hover {
    background: #e9ecef;
    border-color: #adb5bd;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    min-width: calc(50% - 0.25rem);
  }
`;

const ChatInterface = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your PropOps Information Assistant for Ashland MHC. I can help you with community policies, rent information, fees, contact details, and procedures. I can also generate official documents when needed. What would you like to know?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const quickActions = [
    "What is the rent?",
    "How do late fees work?",
    "What's the pet policy?",
    "Who do I contact for emergencies?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        request: input
      });

      if (response.data.success) {
        let assistantMessage;
        
        if (response.data.response_type === 'information') {
          assistantMessage = {
            id: Date.now() + 1,
            text: response.data.answer,
            isUser: false,
            timestamp: new Date(),
            metadata: response.data.metadata
          };
        } else if (response.data.response_type === 'document') {
          assistantMessage = {
            id: Date.now() + 1,
            text: "I've generated your document:",
            isUser: false,
            timestamp: new Date(),
            document: response.data.document,
            metadata: response.data.metadata
          };
        }
        
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(response.data.error || 'Failed to process request');
      }

    } catch (error) {
      console.error('Error generating document:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        text: `Sorry, I encountered an error: ${error.response?.data?.error || error.message}. Please try again or rephrase your request.`,
        isUser: false,
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    setInput(action);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('JSON copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  };

  return (
    <ChatContainer>
      <Header>
        <h1>PropOps Manager Assistant</h1>
        <p>Ashland MHC Document Generation Tool</p>
      </Header>

      <MessagesContainer>
        {messages.map(message => (
          <Message key={message.id} isUser={message.isUser}>
            <div className="bubble">
              {message.text}
              {message.document && (
                <div>
                  <JsonDisplay>
                    {JSON.stringify(message.document, null, 2)}
                  </JsonDisplay>
                  <button 
                    onClick={() => copyToClipboard(JSON.stringify(message.document, null, 2))}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.25rem 0.5rem',
                      fontSize: '0.8rem',
                      background: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Copy JSON
                  </button>
                  {message.metadata && (
                    <small style={{ display: 'block', marginTop: '0.5rem', opacity: 0.7 }}>
                      Generated with {message.metadata.ai_model} • Tokens used: {message.metadata.tokens_used}
                    </small>
                  )}
                </div>
              )}
            </div>
          </Message>
        ))}
        
        {isLoading && (
          <TypingIndicator>
            <div className="bubble">
              <div className="dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </TypingIndicator>
        )}
        
        <div ref={messagesEndRef} />
      </MessagesContainer>

      <InputContainer>
        <QuickActions>
          {quickActions.map((action, index) => (
            <QuickActionButton 
              key={index} 
              onClick={() => handleQuickAction(action)}
              disabled={isLoading}
            >
              {action}
            </QuickActionButton>
          ))}
        </QuickActions>
        
        <InputForm onSubmit={handleSubmit}>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the document you need to create..."
            disabled={isLoading}
            maxLength={1000}
          />
          <SendButton type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? 'Sending...' : 'Send'}
          </SendButton>
        </InputForm>
      </InputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;