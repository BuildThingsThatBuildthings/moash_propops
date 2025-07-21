const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with service role key for backend operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;

if (supabaseUrl && supabaseServiceKey) {
  supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

// Helper to check if Supabase is configured
const isSupabaseConfigured = () => {
  return supabase !== null;
};

// Get current date key for rate limiting (considers 5am reset)
const getCurrentDateKey = () => {
  const now = new Date();
  
  // If it's before 5am, use previous day's date for rate limiting
  if (now.getHours() < 5) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }
  
  return now.toISOString().split('T')[0];
};

// Get next 5AM reset time
const getNext5AMReset = () => {
  const now = new Date();
  const next5AM = new Date(now);
  
  // Set to 5:00 AM
  next5AM.setHours(5, 0, 0, 0);
  
  // If it's already past 5 AM today, set to 5 AM tomorrow
  if (now.getHours() >= 5) {
    next5AM.setDate(next5AM.getDate() + 1);
  }
  
  return next5AM.toISOString();
};

// Check user's rate limit using Supabase
const checkUserRateLimit = async (userId) => {
  if (!isSupabaseConfigured() || !userId) {
    return { allowed: true, remaining: 10, resetTime: getNext5AMReset() };
  }

  const today = getCurrentDateKey();
  const DAILY_LIMIT = 10;

  try {
    // Try to get existing record
    const { data: existingLimit, error: fetchError } = await supabase
      .from('user_query_limits')
      .select('query_count')
      .eq('user_id', userId)
      .eq('query_date', today)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching rate limit:', fetchError);
      return { allowed: true, remaining: DAILY_LIMIT, resetTime: getNext5AMReset() };
    }

    const currentCount = existingLimit?.query_count || 0;

    if (currentCount >= DAILY_LIMIT) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: getNext5AMReset(),
        count: currentCount
      };
    }

    // Increment the count
    const newCount = currentCount + 1;
    
    if (existingLimit) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_query_limits')
        .update({ query_count: newCount })
        .eq('user_id', userId)
        .eq('query_date', today);

      if (updateError) {
        console.error('Error updating rate limit:', updateError);
      }
    } else {
      // Create new record
      const { error: insertError } = await supabase
        .from('user_query_limits')
        .insert([
          {
            user_id: userId,
            query_date: today,
            query_count: newCount
          }
        ]);

      if (insertError) {
        console.error('Error inserting rate limit:', insertError);
      }
    }

    return {
      allowed: true,
      remaining: DAILY_LIMIT - newCount,
      resetTime: getNext5AMReset(),
      count: newCount
    };

  } catch (error) {
    console.error('Rate limit check error:', error);
    // On error, allow the request but log it
    return { allowed: true, remaining: DAILY_LIMIT, resetTime: getNext5AMReset() };
  }
};

// Verify JWT token and get user
const verifyUser = async (authHeader) => {
  if (!isSupabaseConfigured() || !authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.error('Error verifying user:', error);
      return null;
    }

    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
};

module.exports = {
  supabase,
  isSupabaseConfigured,
  checkUserRateLimit,
  verifyUser,
  getCurrentDateKey,
  getNext5AMReset
};