-- ============================================================
-- STOOTAP COMPLETE MASTER SCHEMA - ALL-IN-ONE
-- ============================================================
-- Production-ready schema for entire Stootap platform
-- Includes core platform + Opportunities & Job Portal
-- Uses IF NOT EXISTS for all tables - safe to run multiple times
-- Version: 3.0 - Master schema
-- ============================================================

-- ============ CORE PLATFORM TABLES ============

-- Profiles table (user accounts)
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(36) PRIMARY KEY,
    full_name TEXT,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT DEFAULT 'student', -- 'student', 'business', 'admin'
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Services table
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    category_id VARCHAR(36) REFERENCES categories(id),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    summary TEXT,
    long_description TEXT,
    base_price_inr NUMERIC(10, 2),
    sku TEXT,
    eta_days INTEGER,
    icon TEXT,
    active BOOLEAN DEFAULT true,
    problem TEXT,
    outcome TEXT,
    includes JSONB,
    prerequisites JSONB,
    timeline TEXT,
    faqs JSONB,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) REFERENCES profiles(id),
    session_id VARCHAR(36),
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'cancelled'
    subtotal_inr NUMERIC(10, 2),
    gst_inr NUMERIC(10, 2) DEFAULT 0,
    total_inr NUMERIC(10, 2),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_session_id ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Order Items table
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    order_id VARCHAR(36) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    service_id VARCHAR(36) REFERENCES services(id),
    name TEXT,
    unit_price_inr NUMERIC(10, 2),
    qty INTEGER DEFAULT 1,
    total_inr NUMERIC(10, 2),
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_service_id ON order_items(service_id);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) REFERENCES profiles(id),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role TEXT, -- 'student', 'business', 'entrepreneur'
    message TEXT,
    kind TEXT DEFAULT 'general', -- 'general', 'inquiry'
    captured_via TEXT, -- 'web_form', 'chat', etc
    metadata JSONB,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);

-- Cart Items table
CREATE TABLE IF NOT EXISTS cart_items (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id VARCHAR(36) NOT NULL,
    service_id VARCHAR(36) NOT NULL REFERENCES services(id),
    qty INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_cart_items_session_id ON cart_items(session_id);

-- Notifications table (core platform)
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES profiles(id),
    type TEXT,
    title TEXT,
    message TEXT,
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- ============ OPPORTUNITIES & JOB PORTAL TABLES ============

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    phone TEXT,
    business_type TEXT NOT NULL,
    industry TEXT,
    company_size TEXT,
    website_url TEXT,
    linkedin_url TEXT,
    gstin TEXT,
    pan TEXT,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    registration_doc_url TEXT,
    logo_url TEXT,
    cover_image_url TEXT,
    verified BOOLEAN DEFAULT false,
    verification_notes TEXT,
    verified_at TIMESTAMP,
    verified_by VARCHAR(36),
    status TEXT DEFAULT 'pending',
    rejection_reason TEXT,
    trial_start_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    subscription_status TEXT DEFAULT 'trial',
    total_jobs_posted INTEGER DEFAULT 0,
    total_applications_received INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_companies_verified ON companies(verified);
CREATE INDEX IF NOT EXISTS idx_companies_city ON companies(city);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at DESC);

-- Company Subscriptions table
CREATE TABLE IF NOT EXISTS company_subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan_type TEXT DEFAULT 'annual',
    status TEXT DEFAULT 'trial',
    price_inr NUMERIC(10, 2) DEFAULT 4999,
    start_date TIMESTAMP DEFAULT now() NOT NULL,
    end_date TIMESTAMP,
    trial_days_used INTEGER DEFAULT 0,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_method TEXT,
    invoice_number TEXT,
    invoice_url TEXT,
    auto_renew BOOLEAN DEFAULT false,
    renewal_reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_company_subscriptions_company_id ON company_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_status ON company_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_end_date ON company_subscriptions(end_date);

-- Job Posts table
CREATE TABLE IF NOT EXISTS job_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    role_type TEXT NOT NULL,
    category TEXT,
    is_paid BOOLEAN DEFAULT false,
    salary_min NUMERIC(10, 2),
    salary_max NUMERIC(10, 2),
    salary_currency TEXT DEFAULT 'INR',
    salary_period TEXT DEFAULT 'monthly',
    experience_level TEXT NOT NULL,
    experience_min INTEGER,
    experience_max INTEGER,
    location_type TEXT NOT NULL,
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    pincode TEXT,
    working_days TEXT,
    working_hours TEXT,
    is_flexible BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    responsibilities TEXT,
    required_skills JSONB,
    preferred_qualifications TEXT,
    education_requirement TEXT,
    benefits JSONB,
    number_of_openings INTEGER DEFAULT 1,
    application_deadline TIMESTAMP,
    start_date TIMESTAMP,
    duration TEXT,
    documents_required JSONB,
    screening_questions JSONB,
    visibility TEXT DEFAULT 'standard',
    status TEXT DEFAULT 'pending',
    admin_approved BOOLEAN DEFAULT false,
    admin_notes TEXT,
    approved_at TIMESTAMP,
    approved_by VARCHAR(36),
    platform_fee_paid BOOLEAN DEFAULT false,
    platform_fee_amount NUMERIC(10, 2) DEFAULT 199,
    featured_until TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL,
    published_at TIMESTAMP,
    closed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_job_posts_company_id ON job_posts(company_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_status ON job_posts(status);
CREATE INDEX IF NOT EXISTS idx_job_posts_role_type ON job_posts(role_type);
CREATE INDEX IF NOT EXISTS idx_job_posts_location_type ON job_posts(location_type);
CREATE INDEX IF NOT EXISTS idx_job_posts_category ON job_posts(category);
CREATE INDEX IF NOT EXISTS idx_job_posts_slug ON job_posts(slug);
CREATE INDEX IF NOT EXISTS idx_job_posts_created_at ON job_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_posts_published_at ON job_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_posts_admin_approved ON job_posts(admin_approved);
CREATE INDEX IF NOT EXISTS idx_job_posts_city ON job_posts(city);
CREATE INDEX IF NOT EXISTS idx_job_posts_experience_level ON job_posts(experience_level);

-- Job Post Payments table
CREATE TABLE IF NOT EXISTS job_post_payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    job_post_id VARCHAR(36) NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    amount_inr NUMERIC(10, 2) DEFAULT 199,
    gst_amount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) DEFAULT 199,
    payment_type TEXT DEFAULT 'platform_fee',
    status TEXT DEFAULT 'pending',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_method TEXT,
    valid_until TIMESTAMP,
    invoice_number TEXT,
    invoice_url TEXT,
    refund_reason TEXT,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_job_post_payments_job_id ON job_post_payments(job_post_id);
CREATE INDEX IF NOT EXISTS idx_job_post_payments_company_id ON job_post_payments(company_id);
CREATE INDEX IF NOT EXISTS idx_job_post_payments_status ON job_post_payments(status);

-- Job Applications table
CREATE TABLE IF NOT EXISTS job_applications (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    job_post_id VARCHAR(36) NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    candidate_id VARCHAR(36) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college_name TEXT,
    degree TEXT,
    graduation_year INTEGER,
    current_location TEXT,
    experience_summary TEXT,
    years_of_experience NUMERIC(3, 1) DEFAULT 0,
    current_ctc NUMERIC(10, 2),
    expected_ctc NUMERIC(10, 2),
    notice_period TEXT,
    preferred_hours TEXT,
    available_start_date TIMESTAMP,
    cv_url TEXT NOT NULL,
    cv_file_name TEXT,
    cv_uploaded_at TIMESTAMP DEFAULT now(),
    portfolio_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    cover_note TEXT,
    screening_answers JSONB,
    bank_details_consent BOOLEAN DEFAULT false,
    bank_account_number TEXT,
    bank_ifsc_code TEXT,
    bank_holder_name TEXT,
    status TEXT DEFAULT 'applied',
    status_history JSONB DEFAULT '[]',
    company_notes TEXT,
    candidate_rating INTEGER,
    interview_date TIMESTAMP,
    interview_notes TEXT,
    offer_amount NUMERIC(10, 2),
    offer_date TIMESTAMP,
    rejection_reason TEXT,
    last_viewed_by_company TIMESTAMP,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_post_id ON job_applications(job_post_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_company_id ON job_applications(company_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_candidate_id ON job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_job_applications_unique ON job_applications(job_post_id, candidate_id);

-- Saved Jobs table
CREATE TABLE IF NOT EXISTS saved_jobs (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL,
    job_post_id VARCHAR(36) NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    UNIQUE(user_id, job_post_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_job_post_id ON saved_jobs(job_post_id);

-- Saved Companies table
CREATE TABLE IF NOT EXISTS saved_companies (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    UNIQUE(user_id, company_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_companies_user_id ON saved_companies(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_companies_company_id ON saved_companies(company_id);

-- CV Download Logs table
CREATE TABLE IF NOT EXISTS cv_download_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    application_id VARCHAR(36) NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    job_post_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL,
    downloaded_by VARCHAR(36) NOT NULL,
    downloaded_at TIMESTAMP DEFAULT now() NOT NULL,
    ip_address TEXT,
    user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_cv_download_logs_application_id ON cv_download_logs(application_id);
CREATE INDEX IF NOT EXISTS idx_cv_download_logs_company_id ON cv_download_logs(company_id);
CREATE INDEX IF NOT EXISTS idx_cv_download_logs_downloaded_at ON cv_download_logs(downloaded_at DESC);

-- Opportunity Notifications table
CREATE TABLE IF NOT EXISTS opportunity_notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    related_company_id VARCHAR(36),
    related_job_id VARCHAR(36),
    related_application_id VARCHAR(36),
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    email_sent BOOLEAN DEFAULT false,
    email_sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_opportunity_notifications_user_id ON opportunity_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunity_notifications_read ON opportunity_notifications(read);
CREATE INDEX IF NOT EXISTS idx_opportunity_notifications_type ON opportunity_notifications(type);
CREATE INDEX IF NOT EXISTS idx_opportunity_notifications_created_at ON opportunity_notifications(created_at DESC);

-- ============ FUNCTIONS ============

-- Function to increment job view count
CREATE OR REPLACE FUNCTION increment_job_view_count(job_id VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE job_posts SET view_count = view_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update company stats
CREATE OR REPLACE FUNCTION update_company_job_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE companies 
        SET total_jobs_posted = total_jobs_posted + 1 
        WHERE id = NEW.company_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE companies 
        SET total_jobs_posted = total_jobs_posted - 1 
        WHERE id = OLD.company_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update application count
CREATE OR REPLACE FUNCTION update_job_application_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE job_posts 
        SET application_count = application_count + 1 
        WHERE id = NEW.job_post_id;
        UPDATE companies 
        SET total_applications_received = total_applications_received + 1 
        WHERE id = NEW.company_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE job_posts 
        SET application_count = application_count - 1 
        WHERE id = OLD.job_post_id;
        UPDATE companies 
        SET total_applications_received = total_applications_received - 1 
        WHERE id = OLD.company_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============ TRIGGERS ============

-- Auto-update timestamps for companies
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update timestamps for job_posts
DROP TRIGGER IF EXISTS update_job_posts_updated_at ON job_posts;
CREATE TRIGGER update_job_posts_updated_at
    BEFORE UPDATE ON job_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update timestamps for job_applications
DROP TRIGGER IF EXISTS update_job_applications_updated_at ON job_applications;
CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update timestamps for company_subscriptions
DROP TRIGGER IF EXISTS update_company_subscriptions_updated_at ON company_subscriptions;
CREATE TRIGGER update_company_subscriptions_updated_at
    BEFORE UPDATE ON company_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update company job count
DROP TRIGGER IF EXISTS update_company_job_count ON job_posts;
CREATE TRIGGER update_company_job_count
    AFTER INSERT OR DELETE ON job_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_company_job_stats();

-- Auto-update job application count
DROP TRIGGER IF EXISTS update_job_app_count ON job_applications;
CREATE TRIGGER update_job_app_count
    AFTER INSERT OR DELETE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_job_application_count();

-- ============ ROW LEVEL SECURITY ============

-- Enable RLS on all tables
ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_post_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS saved_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS cv_download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS opportunity_notifications ENABLE ROW LEVEL SECURITY;

-- Service role full access (for backend)
DROP POLICY IF EXISTS "Service role full access - profiles" ON profiles;
CREATE POLICY "Service role full access - profiles" ON profiles FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - categories" ON categories;
CREATE POLICY "Service role full access - categories" ON categories FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - services" ON services;
CREATE POLICY "Service role full access - services" ON services FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - orders" ON orders;
CREATE POLICY "Service role full access - orders" ON orders FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - order_items" ON order_items;
CREATE POLICY "Service role full access - order_items" ON order_items FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - leads" ON leads;
CREATE POLICY "Service role full access - leads" ON leads FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - cart_items" ON cart_items;
CREATE POLICY "Service role full access - cart_items" ON cart_items FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - notifications" ON notifications;
CREATE POLICY "Service role full access - notifications" ON notifications FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - companies" ON companies;
CREATE POLICY "Service role full access - companies" ON companies FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - company_subscriptions" ON company_subscriptions;
CREATE POLICY "Service role full access - company_subscriptions" ON company_subscriptions FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - job_posts" ON job_posts;
CREATE POLICY "Service role full access - job_posts" ON job_posts FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - job_post_payments" ON job_post_payments;
CREATE POLICY "Service role full access - job_post_payments" ON job_post_payments FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - job_applications" ON job_applications;
CREATE POLICY "Service role full access - job_applications" ON job_applications FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - saved_jobs" ON saved_jobs;
CREATE POLICY "Service role full access - saved_jobs" ON saved_jobs FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - saved_companies" ON saved_companies;
CREATE POLICY "Service role full access - saved_companies" ON saved_companies FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - cv_download_logs" ON cv_download_logs;
CREATE POLICY "Service role full access - cv_download_logs" ON cv_download_logs FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role full access - opportunity_notifications" ON opportunity_notifications;
CREATE POLICY "Service role full access - opportunity_notifications" ON opportunity_notifications FOR ALL USING (auth.role() = 'service_role');

-- Authenticated user access (critical for registration and applications)
DROP POLICY IF EXISTS "Allow users to create own profile" ON profiles;
CREATE POLICY "Allow users to create own profile" ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id::uuid);

DROP POLICY IF EXISTS "Allow users to view own profile" ON profiles;
CREATE POLICY "Allow users to view own profile" ON profiles FOR SELECT
  USING (auth.uid() = id::uuid);

DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
CREATE POLICY "Allow users to update own profile" ON profiles FOR UPDATE
  USING (auth.uid() = id::uuid)
  WITH CHECK (auth.uid() = id::uuid);

-- Allow authenticated users to create job applications
DROP POLICY IF EXISTS "Allow users to create own applications" ON job_applications;
CREATE POLICY "Allow users to create own applications" ON job_applications FOR INSERT
  WITH CHECK (auth.uid() = candidate_id::uuid);

-- Allow authenticated users to apply for jobs and save jobs
DROP POLICY IF EXISTS "Allow users to save own jobs" ON saved_jobs;
CREATE POLICY "Allow users to save own jobs" ON saved_jobs FOR ALL
  USING (auth.uid() = user_id::uuid)
  WITH CHECK (auth.uid() = user_id::uuid);

-- Public read access for active content
DROP POLICY IF EXISTS "Public view active jobs" ON job_posts;
CREATE POLICY "Public view active jobs" ON job_posts FOR SELECT USING (status = 'active' AND admin_approved = true);

DROP POLICY IF EXISTS "Public view verified companies" ON companies;
CREATE POLICY "Public view verified companies" ON companies FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Public view services" ON services;
CREATE POLICY "Public view services" ON services FOR SELECT USING (active = true);

DROP POLICY IF EXISTS "Public view categories" ON categories;
CREATE POLICY "Public view categories" ON categories FOR SELECT USING (true);

-- ============ FINAL CONFIRMATION ============

SELECT 'Complete master schema created successfully!' as message;
SELECT 'All 16 tables created with IF NOT EXISTS' as info;
SELECT 'Core Platform: profiles, categories, services, orders, order_items, leads, cart_items, notifications' as core_tables;
SELECT 'Opportunities Portal: companies, company_subscriptions, job_posts, job_post_payments, job_applications, saved_jobs, saved_companies, cv_download_logs, opportunity_notifications' as opportunities_tables;
SELECT 'All indexes, functions, triggers, and RLS policies ready!' as features;
