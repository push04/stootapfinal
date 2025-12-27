
-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'business',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  phone TEXT,
  business_type TEXT NOT NULL,
  website_url TEXT,
  gstin TEXT,
  description TEXT,
  city TEXT,
  state TEXT,
  registration_doc_url TEXT,
  logo_url TEXT,
  verified BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'active',
  trial_start_date TIMESTAMP WITH TIME ZONE,
  trial_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Job Posts
CREATE TABLE IF NOT EXISTS job_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  role_type TEXT NOT NULL,
  is_paid BOOLEAN NOT NULL DEFAULT false,
  salary_min DECIMAL(10, 2),
  salary_max DECIMAL(10, 2),
  experience_level TEXT NOT NULL,
  location_type TEXT NOT NULL,
  city TEXT,
  working_days TEXT,
  working_hours TEXT,
  is_flexible BOOLEAN DEFAULT false,
  description TEXT NOT NULL,
  responsibilities TEXT,
  required_skills JSONB,
  preferred_qualifications TEXT,
  number_of_openings INTEGER DEFAULT 1,
  application_deadline TIMESTAMP WITH TIME ZONE,
  documents_required JSONB,
  visibility TEXT NOT NULL DEFAULT 'standard',
  status TEXT NOT NULL DEFAULT 'active',
  platform_fee_paid BOOLEAN DEFAULT false,
  featured_until TIMESTAMP WITH TIME ZONE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_post_id UUID NOT NULL,
  company_id UUID NOT NULL,
  candidate_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college_name TEXT,
  experience_summary TEXT,
  preferred_hours TEXT,
  available_start_date TIMESTAMP WITH TIME ZONE,
  cv_url TEXT NOT NULL,
  cover_note TEXT,
  bank_details_consent BOOLEAN DEFAULT false,
  bank_account_number TEXT,
  bank_ifsc_code TEXT,
  status TEXT NOT NULL DEFAULT 'applied',
  company_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  summary TEXT NOT NULL,
  long_description TEXT,
  base_price_inr DECIMAL(10, 2) NOT NULL,
  sku TEXT,
  eta_days INTEGER NOT NULL,
  icon TEXT DEFAULT 'Package',
  active BOOLEAN DEFAULT true,
  problem TEXT,
  outcome TEXT,
  includes TEXT,
  prerequisites TEXT,
  timeline TEXT,
  faqs JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  session_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  subtotal_inr DECIMAL(10, 2) NOT NULL,
  gst_inr DECIMAL(10, 2) NOT NULL,
  total_inr DECIMAL(10, 2) NOT NULL,
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  customer_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL,
  service_id UUID NOT NULL,
  name TEXT NOT NULL,
  unit_price_inr DECIMAL(10, 2) NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  total_inr DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL,
  message TEXT NOT NULL,
  kind TEXT DEFAULT 'general',
  captured_via TEXT DEFAULT 'web_form',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  service_id UUID NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()) NOT NULL
);
