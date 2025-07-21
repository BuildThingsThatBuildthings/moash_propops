// Simple rate limiter for daily query limits
// Uses in-memory storage (resets on function cold starts)
// For production, consider using external storage like Redis or KV store

const dailyLimits = new Map();
const DAILY_LIMIT = 10;

function getCurrentDateKey() {
  const now = new Date();
  
  // If it's before 5am, use previous day's date for rate limiting
  // This makes the "day" reset at 5am instead of midnight
  if (now.getHours() < 5) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0]; // YYYY-MM-DD format
  }
  
  return now.toISOString().split('T')[0]; // YYYY-MM-DD format
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
      resetTime: getNext5AMReset(),
      count: currentCount
    };
  }
  
  // Increment count
  dailyLimits.set(key, currentCount + 1);
  
  return {
    allowed: true,
    remaining: DAILY_LIMIT - (currentCount + 1),
    resetTime: getNext5AMReset(),
    count: currentCount + 1
  };
}

function getNext5AMReset() {
  const now = new Date();
  const next5AM = new Date(now);
  
  // Set to 5:00 AM
  next5AM.setHours(5, 0, 0, 0);
  
  // If it's already past 5 AM today, set to 5 AM tomorrow
  if (now.getHours() >= 5) {
    next5AM.setDate(next5AM.getDate() + 1);
  }
  
  return next5AM.toISOString();
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