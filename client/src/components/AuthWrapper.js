import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import ChatInterface from './ChatInterface';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #6c757d;
`;

const AuthContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Logo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #2c3e50;
    font-size: 2rem;
    margin: 0;
  }
  
  p {
    color: #6c757d;
    margin: 0.5rem 0 0 0;
  }
`;

const NoAuthMessage = styled.div`
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  text-align: center;
  
  h3 {
    color: #856404;
    margin: 0 0 1rem 0;
  }
  
  p {
    color: #856404;
    margin: 0;
  }
`;

const AuthWrapper = () => {
  const { user, loading, isAuthenticated, isSupabaseConfigured } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'

  // Show loading state while checking authentication
  if (loading) {
    return (
      <LoadingContainer>
        Loading...
      </LoadingContainer>
    );
  }

  // If Supabase is not configured, show the chat interface without auth
  if (!isSupabaseConfigured) {
    return (
      <Container>
        <NoAuthMessage>
          <h3>Authentication Not Configured</h3>
          <p>
            The app is running without authentication. To enable user accounts and 
            per-user rate limiting, please configure Supabase credentials.
          </p>
        </NoAuthMessage>
        <ChatInterface />
      </Container>
    );
  }

  // If authenticated, show the chat interface
  if (isAuthenticated) {
    return <ChatInterface />;
  }

  // Otherwise, show login/signup forms
  return (
    <AuthContainer>
      <Logo>
        <h1>PropOps Assistant</h1>
        <p>Ashland MHC Community Manager Portal</p>
      </Logo>
      
      {authMode === 'login' ? (
        <LoginForm onToggleMode={() => setAuthMode('signup')} />
      ) : (
        <SignupForm onToggleMode={() => setAuthMode('login')} />
      )}
    </AuthContainer>
  );
};

export default AuthWrapper;