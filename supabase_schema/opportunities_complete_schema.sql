-- ============================================================
-- STOOTAP OPPORTUNITIES & COMPANY LISTINGS - COMPLETE SCHEMA
-- ============================================================
-- Run this in your Supabase SQL Editor to set up all tables
-- This is a standalone file - run AFTER your main Stootap schema

-- Drop existing tables if they exist (in correct order for foreign keys)
DROP TABLE IF EXISTS cv_download_logs CASCADE;
DROP TABLE IF EXISTS saved_companies CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS job_post_payments CASCADE;
DROP TABLE IF EXISTS job_posts CASCADE;
DROP TABLE IF EXISTS company_subscriptions CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- ============ COMPANIES TABLE ============
CREATE TABLE companies (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    user_id VARCHAR(36) NOT NULL,
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
    trial_start_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE companies IS 'Registered companies that can post jobs and internships';

-- ============ COMPANY SUBSCRIPTIONS TABLE ============
CREATE TABLE company_subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL DEFAULT 'featured',
    status TEXT NOT NULL DEFAULT 'trial',
    price_inr NUMERIC(10, 2) NOT NULL DEFAULT 4999,
    start_date TIMESTAMP DEFAULT now() NOT NULL,
    end_date TIMESTAMP,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE company_subscriptions IS 'Company subscription and billing records';

-- ============ JOB POSTS TABLE ============
CREATE TABLE job_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    role_type TEXT NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    salary_min NUMERIC(10, 2),
    salary_max NUMERIC(10, 2),
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
    application_deadline TIMESTAMP,
    documents_required JSONB,
    visibility TEXT NOT NULL DEFAULT 'standard',
    status TEXT NOT NULL DEFAULT 'active',
    platform_fee_paid BOOLEAN DEFAULT false,
    featured_until TIMESTAMP,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE job_posts IS 'Job and internship listings posted by companies';

-- ============ JOB POST PAYMENTS TABLE ============
CREATE TABLE job_post_payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    job_post_id VARCHAR(36) NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    amount_inr NUMERIC(10, 2) NOT NULL DEFAULT 199,
    payment_type TEXT NOT NULL DEFAULT 'platform_fee',
    status TEXT NOT NULL DEFAULT 'pending',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE job_post_payments IS 'Payment records for paid job listings';

-- ============ JOB APPLICATIONS TABLE ============
CREATE TABLE job_applications (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    job_post_id VARCHAR(36) NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    candidate_id VARCHAR(36) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    college_name TEXT,
    experience_summary TEXT,
    preferred_hours TEXT,
    available_start_date TIMESTAMP,
    cv_url TEXT NOT NULL,
    cover_note TEXT,
    bank_details_consent BOOLEAN DEFAULT false,
    bank_account_number TEXT,
    bank_ifsc_code TEXT,
    status TEXT NOT NULL DEFAULT 'applied',
    company_notes TEXT,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE job_applications IS 'Student/candidate applications to job postings';

-- ============ SAVED JOBS TABLE ============
CREATE TABLE saved_jobs (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    job_post_id VARCHAR(36) NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    UNIQUE(user_id, job_post_id)
);

COMMENT ON TABLE saved_jobs IS 'Jobs saved/bookmarked by users';

-- ============ SAVED COMPANIES TABLE ============
CREATE TABLE saved_companies (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    UNIQUE(user_id, company_id)
);

COMMENT ON TABLE saved_companies IS 'Companies followed by users';

-- ============ CV DOWNLOAD LOGS TABLE ============
CREATE TABLE cv_download_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    application_id VARCHAR(36) NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    downloaded_by VARCHAR(36) NOT NULL,
    downloaded_at TIMESTAMP DEFAULT now() NOT NULL,
    ip_address TEXT
);

COMMENT ON TABLE cv_download_logs IS 'Track when companies download candidate CVs';

-- ============ INDEXES FOR PERFORMANCE ============
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_verified ON companies(verified);
CREATE INDEX idx_company_subscriptions_company_id ON company_subscriptions(company_id);
CREATE INDEX idx_company_subscriptions_status ON company_subscriptions(status);
CREATE INDEX idx_job_posts_company_id ON job_posts(company_id);
CREATE INDEX idx_job_posts_status ON job_posts(status);
CREATE INDEX idx_job_posts_role_type ON job_posts(role_type);
CREATE INDEX idx_job_posts_location_type ON job_posts(location_type);
CREATE INDEX idx_job_posts_slug ON job_posts(slug);
CREATE INDEX idx_job_posts_created_at ON job_posts(created_at DESC);
CREATE INDEX idx_job_applications_job_post_id ON job_applications(job_post_id);
CREATE INDEX idx_job_applications_company_id ON job_applications(company_id);
CREATE INDEX idx_job_applications_candidate_id ON job_applications(candidate_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_companies_user_id ON saved_companies(user_id);

-- ============ FUNCTION: INCREMENT VIEW COUNT ============
CREATE OR REPLACE FUNCTION increment_job_view_count(job_id VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE job_posts SET view_count = view_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- ============ FUNCTION: UPDATE TIMESTAMPS ============
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for auto-updating timestamps
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_posts_updated_at
    BEFORE UPDATE ON job_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============ ROW LEVEL SECURITY (RLS) POLICIES ============
-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_post_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_download_logs ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (for backend operations)
CREATE POLICY "Service role has full access to companies" ON companies
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to company_subscriptions" ON company_subscriptions
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to job_posts" ON job_posts
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to job_post_payments" ON job_post_payments
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to job_applications" ON job_applications
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to saved_jobs" ON saved_jobs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to saved_companies" ON saved_companies
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access to cv_download_logs" ON cv_download_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Public read access for active jobs and verified companies
CREATE POLICY "Anyone can view active jobs" ON job_posts
    FOR SELECT USING (status = 'active');

CREATE POLICY "Anyone can view active companies" ON companies
    FOR SELECT USING (status = 'active');

-- ============ SUPABASE STORAGE BUCKET SETUP ============
-- Run these commands separately in the Supabase Dashboard > Storage

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('cvs', 'cvs', true);

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('company-logos', 'company-logos', true);

-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('company-docs', 'company-docs', false);

SELECT 'Opportunities schema created successfully!' as message;
