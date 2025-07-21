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

### Option 3: Cloud Deployment

#### Frontend (Netlify)
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/build`
3. Add environment variables in Netlify dashboard:
   - `REACT_APP_API_URL=https://your-backend-url.railway.app/api`
4. Deploy automatically on push to main

#### Frontend (Alternative: Vercel)
1. Connect your GitHub repository to Vercel  
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/build`
4. Add environment variable: `REACT_APP_API_URL=https://your-backend-url.railway.app/api`
5. Deploy automatically on push to main

#### Backend (Railway)
1. Connect your GitHub repository to Railway
2. Set root directory to `server` 
3. Add environment variables:
   - `OPENAI_API_KEY=your_api_key`
   - `NODE_ENV=production`
4. Railway will auto-deploy on push to main
5. Note your Railway app URL for frontend configuration

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

## Troubleshooting

### "Page Not Found" on Netlify
If you're getting 404 errors on page refresh or direct URL access:

1. **Check `_redirects` file**: Ensure `client/public/_redirects` exists with:
   ```
   /*    /index.html   200
   ```

2. **Verify build settings** in Netlify dashboard:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/build`

3. **Check API connection**: If chat doesn't work, verify:
   - Environment variable `REACT_APP_API_URL` is set in Netlify
   - Backend is deployed and accessible
   - CORS is configured for your Netlify domain

### API Connection Issues
1. **Backend not responding**: Check Railway deployment logs
2. **CORS errors**: Add your Netlify domain to backend CORS configuration
3. **API URL mismatch**: Verify `REACT_APP_API_URL` points to correct backend URL

### Local Development Issues
1. **Port conflicts**: Backend runs on 5001, frontend on 3000
2. **API key missing**: Copy `server/.env.example` to `server/.env` and add OpenAI key
3. **Dependencies**: Run `npm run install-deps` from project root

## Support

- GitHub Issues: https://github.com/BuildThingsThatBuildthings/moash_propops/issues
- Documentation: See README.md and CLAUDE.md