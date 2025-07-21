import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const SetupCard = styled.div`
  max-width: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  color: #2c3e50;
  font-size: 2rem;
  margin: 0 0 1rem 0;
`;

const Subtitle = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0 0 2rem 0;
`;

const SetupSection = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  text-align: left;
`;

const SectionTitle = styled.h3`
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const StepList = styled.ol`
  margin: 0;
  padding-left: 1.5rem;
  
  li {
    margin: 0.5rem 0;
    color: #495057;
  }
`;

const CodeBlock = styled.div`
  background: #f1f3f4;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 1rem;
  margin: 1rem 0;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  text-align: left;
  overflow-x: auto;
`;

const WarningBox = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  color: #856404;
  
  strong {
    display: block;
    margin-bottom: 0.5rem;
  }
`;

const LinkButton = styled.a`
  display: inline-block;
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 600;
  margin: 0.5rem;
  transition: background 0.2s;
  
  &:hover {
    background: #0056b3;
    color: white;
    text-decoration: none;
  }
`;

const SetupRequired = () => {
  return (
    <Container>
      <SetupCard>
        <Title>🔐 Authentication Setup Required</Title>
        <Subtitle>
          PropOps Assistant requires Supabase authentication to be configured before you can access the chat interface.
        </Subtitle>

        <WarningBox>
          <strong>Access Restricted</strong>
          For security and user management, authentication must be enabled before using this application.
        </WarningBox>

        <SetupSection>
          <SectionTitle>Required Environment Variables</SectionTitle>
          <p>Add these to your Netlify environment variables:</p>
          <CodeBlock>
            REACT_APP_SUPABASE_URL=https://your-project.supabase.co<br/>
            REACT_APP_SUPABASE_ANON_KEY=your-anon-key<br/>
            SUPABASE_URL=https://your-project.supabase.co<br/>
            SUPABASE_SERVICE_KEY=your-service-key
          </CodeBlock>
        </SetupSection>

        <SetupSection>
          <SectionTitle>Quick Setup Steps</SectionTitle>
          <StepList>
            <li>Create a free account at <strong>supabase.com</strong></li>
            <li>Create a new project and note your credentials</li>
            <li>Run the database schema from <code>supabase/schema.sql</code></li>
            <li>Add environment variables to Netlify</li>
            <li>Redeploy to activate authentication</li>
          </StepList>
        </SetupSection>

        <div>
          <LinkButton 
            href="https://supabase.com" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Create Supabase Account
          </LinkButton>
          
          <LinkButton 
            href="https://github.com/BuildThingsThatBuildthings/moash_propops/blob/main/SUPABASE_SETUP.md" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            View Setup Guide
          </LinkButton>
        </div>

        <SetupSection style={{ marginTop: '2rem' }}>
          <SectionTitle>Why Authentication is Required</SectionTitle>
          <ul style={{ textAlign: 'left', color: '#6c757d' }}>
            <li><strong>User-based rate limiting:</strong> 10 queries per day per user</li>
            <li><strong>Persistent tracking:</strong> Usage stored in database</li>
            <li><strong>Security:</strong> Proper access control and data isolation</li>
            <li><strong>Multi-user support:</strong> Individual accounts for team members</li>
          </ul>
        </SetupSection>
      </SetupCard>
    </Container>
  );
};

export default SetupRequired;