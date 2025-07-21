# PropOps Community Manager Assistant

A document generation tool for community managers at Ashland Mobile Home Community (MHC). This tool helps create standardized notices, violations, and other official documents with consistent JSON structured output.

## Features

- **Violation Notices**: Pet violations, parking violations, lawn maintenance, general rules violations
- **Late Rent Notices**: Automatic calculation of late fees and total amounts due
- **Maintenance Notices**: Heat tape inspections, property maintenance requirements
- **Structured JSON Output**: Consistent formatting for integration with management systems
- **Mobile-First Design**: Optimized for use on phones and tablets
- **Natural Language Processing**: Create documents by describing what you need

## Quick Start

### Prerequisites
- Node.js 16+ 
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm run install-deps
```

3. Set up environment variables:
```bash
cd server
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
```

4. Start the development servers:
```bash
npm run dev
```

This will start:
- Backend server on http://localhost:5000
- Frontend on http://localhost:3000

## Usage Examples

### Creating Documents

Simply describe what you need in natural language:

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