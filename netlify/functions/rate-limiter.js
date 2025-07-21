// Simple rate limiter for daily query limits
// Uses in-memory storage (resets on function cold starts)
// For production, consider using external storage like Redis or KV store

const dailyLimits = new Map();
const DAILY_LIMIT = 10;

function getCurrentDateKey() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
}

function getClientId(event) {
  // Use IP address as client identifier
  // In production, you might want to use user sessions or API keys
  return event.headers['x-forwarded-for'] || 
         event.headers['x-real-ip'] || 
         'unknown-client';
}

function checkRateLimit(clientId) {
  const today = getCurrentDateKey();
  const key = `${clientId}-${today}`;
  
  const currentCount = dailyLimits.get(key) || 0;
  
  if (currentCount >= DAILY_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      count: currentCount
    };
  }
  
  // Increment count
  dailyLimits.set(key, currentCount + 1);
  
  return {
    allowed: true,
    remaining: DAILY_LIMIT - (currentCount + 1),
    resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    count: currentCount + 1
  };
}

function cleanupOldEntries() {
  const today = getCurrentDateKey();
  for (let [key, value] of dailyLimits) {
    if (!key.endsWith(today)) {
      dailyLimits.delete(key);
    }
  }
}

module.exports = {
  checkRateLimit,
  getClientId,
  cleanupOldEntries,
  DAILY_LIMIT
};