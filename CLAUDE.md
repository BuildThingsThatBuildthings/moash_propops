# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This repository contains the **PropOps Community Manager Information Assistant** - an AI-powered chatbot designed to help community managers at Ashland Mobile Home Community (MOASH) quickly access policies, procedures, rent information, and community guidelines. The primary purpose is information retrieval with optional document generation capabilities.

## Key Documentation Files

### Core Planning Documents
- `propopsPRD.md` - Complete Product Requirements Document with technical stack, implementation timeline, and feature roadmap
- `buildcontext.md` - Specific community information for Ashland MHC including policies, contact info, and operational details

## Project Architecture (From PRD Analysis)

### Current Technology Stack
- **Frontend**: React with styled-components
- **Backend**: Netlify Functions (serverless)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: OpenAI SDK v4 with GPT-4o-mini
- **Deployment**: Netlify
- **UI Components**: Custom chat interface with mobile-first design

### Core Feature Categories (Information First)
1. **Policy Information** - Quick access to rent amounts, late fees, community rules, pet policies
2. **Contact Directory** - Tenant vs vendor contact information, emergency numbers, management details  
3. **Procedure Guidance** - How to handle violations, maintenance requests, lease issues
4. **Fee Calculations** - Late rent fees, violation penalties, administrative charges
5. **Document Generation** - Optional creation of violation notices and official documents

## Development Workflow Recommendations

### Security Requirements
- API key management with environment variables
- Prompt injection prevention patterns
- User-based rate limiting (10 queries/day per user)
- JWT-based authentication with Supabase Auth
- Row Level Security (RLS) for user data isolation
- Cost control with spending thresholds at 90%/95%
- 30-day conversation retention with audit logs

### Conversation Flow Patterns
- Follow linear flows with limited branching
- Implement three-strike error handling system
- Mobile-first design with bottom-positioned input fields
- Sequential step guidance for complex processes

### Testing Strategy
- Conversation context testing across message flows
- Semantic versioning for prompt templates
- Performance metrics tracking (response time <2s, 70%+ automation rate)

## Community-Specific Context (Ashland MHC)

### Key Information
- **Location**: 111 East Side Dr., Ashland, MO 65010
- **Management**: Anthony Thompson (Property Manager)
- **Tenant Contact**: 1-800-209-1533, TenantHelp@mhcpusa.com
- **Monthly Lot Rent**: $290.00
- **Occupancy**: 48/104 lots (46.15%)
- **Home Sales Partner**: Amega Home Sales - Porter Deline (573) 657-2176

### Critical Policies
- Month-to-month leases with 30-day notice
- No direct home sales by park management
- Pet screening via PetScreening.com with FIDO score-based rent
- 15-year minimum age limit for used homes
- Required heat tape maintenance for winterization
- Specific parking and guest policies

### Compliance Requirements
- Fair housing compliance for all AI interactions
- GDPR/CCPA data subject rights implementation
- OpenAI Data Processing Agreement execution
- Missouri state and Boone County regulation adherence

## Mobile Home Park Industry Specifics

### Unique Requirements
- **Dual Ownership Model**: Separate lot rent from home ownership
- **Utility Complexity**: Master-metered vs individual billing
- **Transfer Processes**: Home sales requiring park approval workflows
- **Community Standards**: Maintenance requirements beyond typical rentals

### Information Retrieval Targets
- <2 second response time for policy queries
- 100% accuracy for rent, fee, and contact information
- Comprehensive coverage of all Ashland MHC policies
- Reduce time spent searching through documentation by 80%

## Development Commands

### Quick Start
```bash
./start.sh                  # Run the complete setup and start both servers
```

### Individual Commands
```bash
npm run install-deps        # Install all dependencies
npm run dev                 # Start both frontend and backend
npm run server              # Start backend only
npm run client              # Start frontend only
npm run build               # Build frontend for production
```

### Testing the MVP
1. Start the application with `./start.sh`
2. Open http://localhost:3000 in your browser
3. Try test requests from `examples/test-requests.md`

## Development Notes

**✅ MVP SCOPE** - Information Chatbot with Optional Document Generation:

1. **Primary: Information Assistant**: AI-powered policy and procedure lookup system
2. **Community Knowledge Base**: Instant access to all Ashland MHC policies and procedures
3. **Quick Reference Tool**: Rent amounts, fees, contact info, violation procedures
4. **Mobile-First UI**: Responsive chat interface for community managers on the go
5. **Secondary: Document Generation**: Optional structured document creation when requested

### Primary Features (Information):
- **Policy Queries**: "What is the rent?", "How do late fees work?", "What's the pet policy?"
- **Contact Directory**: Tenant vs vendor numbers, emergency contacts, management info
- **Fee Calculations**: Late rent ($15/day + $25 admin), violation fees, administrative charges
- **Procedure Guidance**: How to handle violations, maintenance, lease issues
- **Community Details**: Occupancy rates, property stats, lease terms

### Secondary Features (Documents):
- **Violation Notices**: When explicitly requested or via dedicated button
- **Structured JSON Output**: For system integration when generating official documents

## Repository Structure

```
moash_propops_assistant/
├── client/                 # React frontend (mobile-first chat UI)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatInterface.js
│   │   │   ├── LoginForm.js (NEW)
│   │   │   ├── SignupForm.js (NEW)
│   │   │   └── AuthWrapper.js (NEW)
│   │   ├── lib/
│   │   │   └── supabase.js (NEW)
│   │   └── contexts/
│   │       └── AuthContext.js (NEW)
│   └── package.json
├── netlify/                # Serverless backend
│   └── functions/
│       ├── chat.js         # Main chat endpoint
│       ├── rate-limiter.js # Rate limiting logic
│       └── health.js       # Health check
├── server/                 # Local development server
│   ├── data/ashland-policies.json    # Community policies & fees
│   ├── schemas/document-schemas.js   # JSON validation schemas
│   ├── services/documentGenerator.js # AI document generation
│   └── server.js
├── examples/test-requests.md         # Example usage scenarios
├── start.sh               # Quick startup script
├── netlify.toml           # Netlify configuration
├── propopsPRD.md          # Original requirements
├── buildcontext.md        # Community context
└── CLAUDE.md              # This guidance file
```

## Usage Examples

### Primary Use Cases (Information):
**Input**: `"What is the rent?"`
**Output**: "The monthly lot rent at Ashland MHC is $290.00. This is for the lot space only, separate from home ownership."

**Input**: `"How do late fees work?"`  
**Output**: "Late fees are $15.00 per day after the 5th of the month, plus a $25.00 administration fee. Legal proceedings begin after the 10th."

**Input**: `"What's the pet policy?"`
**Output**: Detailed explanation of pet screening, FIDO scores, monthly fees ($25-$50), and rules.

### Secondary Use Cases (Documents):
**Input**: `"Generate a pet violation for lot 25"`
**Output**: Complete JSON document with violation details, fees, legal text, and procedures.

When implementing new features, always reference both the technical requirements in the PRD and the community-specific context to ensure the AI assistant accurately reflects Ashland MHC's policies and procedures.

## Authentication & User Management (Supabase Integration)

### Database Schema
```sql
-- User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  property_name TEXT DEFAULT 'Ashland MHC',
  role TEXT DEFAULT 'community_manager',
  created_at TIMESTAMP DEFAULT NOW()
);

-- User query limits table
CREATE TABLE user_query_limits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  query_date DATE NOT NULL,
  query_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, query_date)
);
```

### Authentication Flow
1. **Login/Signup**: Email/password authentication via Supabase Auth
2. **Session Management**: JWT tokens with automatic refresh
3. **Protected Routes**: Redirect to login if not authenticated
4. **User Profile**: Created on signup with manager details
5. **Rate Limiting**: Per-user query tracking in database

### Environment Variables
```bash
# Client (.env.local)
REACT_APP_SUPABASE_URL=your-project-url
REACT_APP_SUPABASE_ANON_KEY=your-anon-key

# Netlify Functions (Environment Variables)
SUPABASE_URL=your-project-url
SUPABASE_SERVICE_KEY=your-service-key
```

### Key Components
- **AuthContext**: Global authentication state management
- **AuthWrapper**: Handles auth redirects and session checks
- **LoginForm/SignupForm**: Simple email/password forms
- **Supabase Client**: Initialized in `lib/supabase.js`

### Security Features
- Row Level Security (RLS) on all tables
- User can only access their own data
- Service key only used in backend functions
- Automatic session refresh handling