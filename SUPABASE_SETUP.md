# Supabase Authentication Setup Guide

This guide will help you set up Supabase authentication for the PropOps Assistant.

## Prerequisites

- A Supabase account (free tier is sufficient)
- Access to Netlify environment variables

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New project"
3. Choose your organization (or create one)
4. Enter project details:
   - **Name**: PropOps Assistant (or your preferred name)
   - **Database Password**: Generate a strong password (save this!)
   - **Region**: Choose the closest to your users
   - **Pricing Plan**: Free tier is sufficient for getting started

## Step 2: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Ensure **Email** is enabled (it should be by default)
3. Configure email settings:
   - Enable "Confirm email" for better security
   - Customize email templates if desired

## Step 3: Set Up Database Tables

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to create all tables and policies

## Step 4: Get Your API Keys

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon/Public Key**: `eyJhbGc...` (safe for client-side use)
   - **Service Role Key**: `eyJhbGc...` (keep secret, server-side only)

## Step 5: Configure Environment Variables

### For Local Development

1. Copy `client/.env.local.example` to `client/.env.local`
2. Update with your Supabase credentials:
```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### For Netlify Production

1. Go to your Netlify project dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add the following variables:
   - `REACT_APP_SUPABASE_URL`: Your Supabase project URL
   - `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_URL`: Your Supabase project URL (for functions)
   - `SUPABASE_SERVICE_KEY`: Your Supabase service role key (for functions)

## Step 6: Deploy and Test

1. Commit and push your changes to trigger a Netlify deployment
2. Once deployed, test the authentication flow:
   - Sign up with a new account
   - Check your email for verification (if enabled)
   - Sign in with your credentials
   - Verify the query counter tracks per user

## Optional: Configure Custom Domain

1. In Supabase, go to **Authentication** → **URL Configuration**
2. Add your Netlify domain to the redirect URLs:
   - `https://your-site.netlify.app`
   - `http://localhost:3000` (for local development)

## Troubleshooting

### Authentication not working
- Verify environment variables are set correctly
- Check browser console for errors
- Ensure Supabase project is not paused (free tier pauses after inactivity)

### Rate limiting not working per user
- Verify the user_query_limits table was created
- Check that the service role key is set in Netlify functions
- Look at function logs in Netlify dashboard

### Database queries failing
- Check Row Level Security policies are created
- Verify the user is properly authenticated
- Check Supabase logs for detailed error messages

## Security Best Practices

1. **Never expose the service role key** on the client side
2. Keep Row Level Security enabled on all tables
3. Regularly rotate your service role key
4. Monitor authentication logs in Supabase dashboard
5. Use environment variables for all sensitive data

## Next Steps

- Consider adding social auth providers (Google, GitHub, etc.)
- Implement email customization for your brand
- Set up database backups in Supabase
- Configure custom SMTP for email delivery