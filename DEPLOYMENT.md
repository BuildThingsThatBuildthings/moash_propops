# PropOps Deployment Guide

## Quick Deployment Options

### Option 1: Local Development
```bash
# Clone the repository
git clone https://github.com/BuildThingsThatBuildthings/moash_propops.git
cd moash_propops

# Quick start with setup script
./start.sh
```

### Option 2: Docker Compose (Recommended for Production)
```bash
# Clone and setup
git clone https://github.com/BuildThingsThatBuildthings/moash_propops.git
cd moash_propops

# Create production environment file
cp .env.production.example .env.production
# Edit .env.production with your OpenAI API key

# Start with Docker
docker-compose up -d
```

### Option 3: Cloud Deployment (Vercel + Railway)

#### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/build`
4. Deploy automatically on push to main

#### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set root directory to `server`
3. Add environment variables:
   - `OPENAI_API_KEY=your_api_key`
   - `NODE_ENV=production`
4. Railway will auto-deploy on push to main

## Environment Variables

### Required
- `OPENAI_API_KEY`: Your OpenAI API key

### Optional
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `CORS_ORIGINS`: Allowed origins for CORS

## Security Checklist

- ✅ API keys stored in environment variables
- ✅ Rate limiting enabled (60 req/min)
- ✅ Input sanitization for prompt injection
- ✅ CORS protection configured
- ✅ Security headers with Helmet
- ✅ Production build optimization

## Monitoring

The application includes:
- Health check endpoint: `GET /api/health`
- Token usage tracking
- Error logging
- Performance metrics

## Scaling Considerations

- **Database**: Currently uses in-memory policies, consider PostgreSQL for user data
- **Caching**: Add Redis for conversation context if needed
- **Load Balancing**: Use multiple server instances behind a load balancer
- **CDN**: Use Cloudflare or similar for static assets

## Support

- GitHub Issues: https://github.com/BuildThingsThatBuildthings/moash_propops/issues
- Documentation: See README.md and CLAUDE.md