# PropOps Community Manager Assistant

An AI-powered information assistant and document generation tool for community managers at Ashland Mobile Home Community (MHC). This tool provides instant access to community policies, procedures, and helps create standardized notices with consistent JSON structured output.

## Features

### Information Assistant (Primary)
- **Policy Lookup**: Instant access to rent amounts, fees, community rules
- **Contact Directory**: Tenant vs vendor numbers, emergency contacts
- **Fee Calculations**: Automatic calculation of late fees and violation penalties
- **Procedure Guidance**: Step-by-step help for common manager tasks

### Document Generation (Secondary)
- **Violation Notices**: Pet violations, parking violations, lawn maintenance
- **Late Rent Notices**: Automatic calculation with proper legal text
- **Maintenance Notices**: Heat tape inspections, property requirements
- **Structured JSON Output**: Consistent formatting for system integration

### Technical Features
- **Mobile-First Design**: Optimized for phones and tablets
- **AI-Powered**: Uses OpenAI GPT-4o-mini for cost-effective responses
- **Authentication**: Optional Supabase integration for user accounts
- **Rate Limiting**: 10 queries per day (resets at 5am)
- **Secure**: JWT authentication, Row Level Security, input sanitization

## Quick Start

### Prerequisites
- Node.js 16+ 
- OpenAI API key
- (Optional) Supabase account for authentication

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
cd client && npm install
```

3. Set up environment variables:

For local development with authentication:
```bash
cd client
cp .env.local.example .env.local
# Edit .env.local and add your Supabase credentials
```

For Netlify deployment:
- Add `OPENAI_API_KEY` to Netlify environment variables
- (Optional) Add Supabase credentials for authentication

4. Start the development server:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3000

### Supabase Setup (Optional)

To enable user authentication:
1. Create a Supabase project
2. Run the SQL from `supabase/schema.sql`
3. Add credentials to environment variables
4. See `SUPABASE_SETUP.md` for detailed instructions

## Usage Examples

### Information Queries (Primary Use)

Ask questions about community policies and procedures:

- **"What is the monthly rent?"** → "$290.00 for lot rent"
- **"How do late fees work?"** → "$15/day after 5th + $25 admin fee"
- **"What's the pet policy?"** → Pet screening requirements and fees
- **"Who do I call for emergencies?"** → Emergency contact information

### Document Generation (Secondary Use)

Create official documents by describing what you need:

- **"Create a pet violation for lot 25"**
- **"Late rent notice for lot 12, tenant is 5 days late"**
- **"Parking violation for lot 8, unauthorized parking"**
- **"Lawn maintenance notice for lot 33, grass too long"**

### Generated Document Structure

Each document includes:
- Document type and unique ID
- Tenant and community information
- Violation details with proper fees
- Legal text and consequences
- Next steps for resolution
- Proper dates and deadlines

## Ashland MHC Policies

The system is configured with Ashland MHC specific information:

- **Monthly Rent**: $290.00
- **Late Fees**: $15.00/day after 5th of month + $25.00 admin fee
- **Violation Fees**: Pet ($100), Parking ($25), Lawn ($35), etc.
- **Contact Information**: Proper escalation and contact details
- **Community Rules**: Based on actual Ashland MHC policies

## API Endpoints

- `POST /api/generate-document` - Generate a document from natural language
- `GET /api/policies` - Get community policies and fee information
- `POST /api/calculate-fees` - Calculate fees for specific violations
- `GET /api/health` - Health check

## Security Features

- Rate limiting (60 requests/minute)
- Input sanitization to prevent prompt injection
- Environment-based API key management
- CORS protection
- Helmet security headers

## Development

### Project Structure
```
propops-manager-assistant/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatInterface.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── data/
│   │   └── ashland-policies.json
│   ├── schemas/
│   │   └── document-schemas.js
│   ├── services/
│   │   └── documentGenerator.js
│   ├── server.js
│   └── package.json
└── package.json           # Root package.json
```

### Adding New Document Types

1. Add schema to `server/schemas/document-schemas.js`
2. Update the document generator prompt in `server/services/documentGenerator.js`
3. Add validation logic for the new document type
4. Update fee information in `ashland-policies.json` if needed

## Cost Management

- Uses GPT-4o-mini for cost efficiency (85% cheaper than GPT-4o)
- Rate limiting prevents abuse
- Token usage tracking for monitoring costs
- Optimized prompts for minimal token consumption

## Deployment

The application is ready for deployment to:
- **Frontend**: Vercel (recommended)
- **Backend**: Railway, Heroku, or similar Node.js hosting

Environment variables needed in production:
- `OPENAI_API_KEY`
- `NODE_ENV=production`
- `PORT` (if different from 5000)

## License

MIT License - See LICENSE file for details