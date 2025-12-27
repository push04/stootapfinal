# Supabase Database Setup Guide

## CRITICAL: Set Up Your Database Tables

Your Supabase database needs tables before the app can work. Follow these steps:

### Step 1: Create Database Tables

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: `mwtzmkqgflwovdopmwgo`
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase_schema/schema.sql` file
6. Paste it into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)

This will create all necessary tables:
- profiles
- categories
- services
- orders
- order_items
- leads
- cart_items
- notifications
- tickets
- documents
- audit_logs
- subscription_plans
- user_subscriptions
- site_content

### Step 2: Verify Tables Were Created

1. In Supabase dashboard, click **Table Editor** in left sidebar
2. You should see all the tables listed above
3. They will be empty - that's normal!

### Step 3: Configure Row Level Security (RLS)

The schema file already disables RLS for these tables since we're using the service role key on the backend. If you want to add RLS later for additional security, you can do so in the Supabase dashboard.

### Step 4: Enable Seeding in Development

Once tables are created, the app will automatically seed sample data when you run it locally in development mode.

## Environment Variables for Netlify Deployment

Set these in Netlify Dashboard → Site Settings → Environment Variables:

### Server-Side (Required)
```
SUPABASE_URL=https://mwtzmkqgflwovdopmwgo.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
SESSION_SECRET=<generate-a-long-random-string>
```

### Client-Side (Required)
```
VITE_PUBLIC_SUPABASE_URL=https://mwtzmkqgflwovdopmwgo.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Optional (for full features)
```
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<generate-using-sha256>
OPENROUTER_API_KEY=<your-openrouter-key>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
```

## How to Find Your Supabase Keys

1. Go to Supabase Dashboard
2. Select your project
3. Click **Settings** (gear icon) → **API**
4. You'll find:
   - **Project URL**: This is your `SUPABASE_URL`
   - **anon/public key**: This is your `VITE_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key**: This is your `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

## Troubleshooting

### "Services not loading" or "Failed to load services"
- **Cause**: Database tables haven't been created
- **Fix**: Run the schema.sql as described in Step 1 above

### "Invalid API key" errors
- **Cause**: Wrong API keys in environment variables
- **Fix**: Double-check your keys match what's in Supabase Dashboard → Settings → API

### "No data showing" after tables are created
- **Cause**: Database is empty
- **Fix**: Re-enable seeding in `server/index.ts` (uncomment the seeding code)

## Next Steps After Setup

1. ✅ Create tables in Supabase (Step 1 above) - **DO THIS FIRST**
2. ✅ Restart your development server
3. ✅ The app will automatically seed with sample data
4. ✅ Test the Services page - you should see 50+ services
5. ✅ Test user registration and login
6. ✅ Deploy to Netlify with environment variables configured
