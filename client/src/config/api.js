// API configuration for different environments
const getApiUrl = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, use relative URLs that will be handled by Netlify redirects
    // or set REACT_APP_API_URL environment variable
    return process.env.REACT_APP_API_URL || '/api';
  }
  
  // In development, use the local proxy
  return '/api';
};

export const API_URL = getApiUrl();

export default {
  API_URL
};