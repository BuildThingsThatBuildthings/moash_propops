import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import ChatInterface from './ChatInterface';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import SetupRequired from './SetupRequired';

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

  // If Supabase is not configured, require setup before allowing access
  if (!isSupabaseConfigured) {
    return <SetupRequired />;
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