# Stootap - Netlify & Supabase Deployment Guide

This guide explains how to set up the required environment variables for deploying Stootap on Netlify with Supabase as the database.

## Required Environment Variables

### Supabase Configuration

You need to configure these environment variables in your Netlify dashboard:

| Variable Name | Description | Where to Find |
|---------------|-------------|---------------|
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Public anonymous key for client-side | Supabase Dashboard → Settings → API → Project API Keys → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret service role key for server-side | Supabase Dashboard → Settings → API → Project API Keys → service_role |

### Payment Integration (Optional)

| Variable Name | Description | Where to Find |
|---------------|-------------|---------------|
| `RAZORPAY_KEY_ID` | Razorpay API Key ID | Razorpay Dashboard → Settings → API Keys |
| `RAZORPAY_KEY_SECRET` | Razorpay API Secret | Razorpay Dashboard → Settings → API Keys |

### Session Security

| Variable Name | Description | Recommended Value |
|---------------|-------------|-------------------|
| `SESSION_SECRET` | Secret for session encryption | Generate a random 32+ character string |

## Step-by-Step Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note down your project URL and API keys from Settings → API

### 2. Create Database Tables

Run the following SQL in your Supabase SQL Editor to create the required tables:

```sql
-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'business',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  base_price_inr DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  features JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT,
  user_id UUID REFERENCES profiles(id),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  total_inr DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_method TEXT,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  name TEXT NOT NULL,
  qty INTEGER DEFAULT 1,
  unit_price_inr DECIMAL(10,2) NOT NULL,
  total_inr DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT DEFAULT 'business',
  message TEXT NOT NULL,
  kind TEXT,
  captured_via TEXT DEFAULT 'web_form',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Cart Items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  service_id UUID REFERENCES services(id),
  qty INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  action_url TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Companies table (for job opportunities)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT DEFAULT 'startup',
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  city TEXT,
  state TEXT,
  verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active',
  trial_start_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Job Posts table
CREATE TABLE IF NOT EXISTS job_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  role_type TEXT DEFAULT 'full_time',
  experience_level TEXT DEFAULT 'entry',
  location_type TEXT DEFAULT 'onsite',
  city TEXT,
  is_paid BOOLEAN DEFAULT true,
  salary_min DECIMAL(10,2),
  salary_max DECIMAL(10,2),
  status TEXT DEFAULT 'active',
  visibility TEXT DEFAULT 'standard',
  platform_fee_paid BOOLEAN DEFAULT false,
  featured_until TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Job Applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_post_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  candidate_id UUID REFERENCES profiles(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  cv_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'applied',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Saved Jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_post_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, job_post_id)
);

-- Saved Companies table
CREATE TABLE IF NOT EXISTS saved_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, company_id)
);

-- Company Subscriptions table
CREATE TABLE IF NOT EXISTS company_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  plan_type TEXT DEFAULT 'free',
  status TEXT DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Job Post Payments table
CREATE TABLE IF NOT EXISTS job_post_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_post_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id),
  amount_inr TEXT NOT NULL,
  payment_type TEXT DEFAULT 'platform_fee',
  status TEXT DEFAULT 'pending',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- CV Download Logs table
CREATE TABLE IF NOT EXISTS cv_download_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES job_applications(id) ON DELETE CASCADE,
  downloaded_by UUID REFERENCES profiles(id),
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Function to increment job view count
CREATE OR REPLACE FUNCTION increment_job_view_count(job_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE job_posts SET view_count = view_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;
```

### 3. Configure Netlify Environment Variables

1. Go to your Netlify dashboard
2. Navigate to Site Settings → Environment Variables
3. Add the following variables:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SESSION_SECRET=your-random-secret-string-here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx (optional)
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx (optional)
```

### 4. Configure Supabase Authentication

1. In Supabase Dashboard → Authentication → Settings
2. Enable Email provider
3. Configure Site URL to your Netlify domain
4. Add redirect URLs for your domain

### 5. Configure Row Level Security (RLS)

For production, enable RLS on all tables and create appropriate policies:

```sql
-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Similar policies for other tables as needed
```

## Troubleshooting

### Common Issues

1. **Connection refused**: Ensure SUPABASE_URL is correct and includes `https://`
2. **Invalid API key**: Double-check the API keys are copied correctly without extra spaces
3. **RLS blocking queries**: Temporarily disable RLS for testing or ensure proper policies

### Testing Connection

You can test your Supabase connection by checking the integration status in the admin dashboard at `/admin` → Integration Status.

## Support

For issues specific to:
- **Supabase**: [supabase.com/docs](https://supabase.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Razorpay**: [razorpay.com/docs](https://razorpay.com/docs)
