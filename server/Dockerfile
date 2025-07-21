FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy server code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S propops -u 1001

# Change ownership of the app directory
RUN chown -R propops:nodejs /app

USER propops

EXPOSE 5000

CMD ["node", "server.js"]