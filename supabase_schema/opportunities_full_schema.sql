-- ============================================================
-- STOOTAP OPPORTUNITIES & JOB PORTAL - FULL SCHEMA
-- ============================================================
-- Run this in your Supabase SQL Editor to set up all tables
-- Version: 2.0 - Complete with all features for 30 tasks
-- 
-- SETUP ORDER:
-- 1. Run this SQL in Supabase Dashboard > SQL Editor
-- 2. Create storage buckets (commands at bottom)
-- 3. Run seed data (optional) from opportunities_seed_data.sql
-- ============================================================

-- Drop existing tables if they exist (in correct order for foreign keys)
DROP TABLE IF EXISTS cv_download_logs CASCADE;
DROP TABLE IF EXISTS saved_companies CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS job_applications CASCADE;
DROP TABLE IF EXISTS job_post_payments CASCADE;
DROP TABLE IF EXISTS job_posts CASCADE;
DROP TABLE IF EXISTS company_subscriptions CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS opportunity_notifications CASCADE;

-- ============ COMPANIES TABLE ============
-- Companies can self-register and post jobs/internships
CREATE TABLE companies (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    phone TEXT,
    business_type TEXT NOT NULL, -- 'startup', 'technology', 'services', 'manufacturing', 'retail', 'other'
    industry TEXT, -- Industry category
    company_size TEXT, -- 'micro', 'small', 'medium', 'large'
    website_url TEXT,
    linkedin_url TEXT,
    gstin TEXT,
    pan TEXT,
    description TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    pincode TEXT,
    registration_doc_url TEXT, -- Registration certificate upload
    logo_url TEXT, -- Company logo from storage
    cover_image_url TEXT, -- Company profile cover
    verified BOOLEAN DEFAULT false, -- Admin verified
    verification_notes TEXT, -- Admin notes on verification
    verified_at TIMESTAMP, -- When verified
    verified_by VARCHAR(36), -- Admin who verified
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'suspended', 'inactive'
    rejection_reason TEXT, -- If rejected by admin
    trial_start_date TIMESTAMP,
    trial_end_date TIMESTAMP,
    subscription_status TEXT DEFAULT 'trial', -- 'trial', 'active', 'expired', 'cancelled'
    total_jobs_posted INTEGER DEFAULT 0,
    total_applications_received INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE companies IS 'Self-registered companies that can post jobs and internships';

CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_status ON companies(status);
CREATE INDEX idx_companies_verified ON companies(verified);
CREATE INDEX idx_companies_city ON companies(city);
CREATE INDEX idx_companies_created_at ON companies(created_at DESC);

-- ============ COMPANY SUBSCRIPTIONS TABLE ============
-- Tracks company subscription payments (₹4,999/year after 60-day trial)
CREATE TABLE company_subscriptions (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    plan_type TEXT NOT NULL DEFAULT 'annual', -- 'trial', 'annual'
    status TEXT NOT NULL DEFAULT 'trial', -- 'trial', 'active', 'expired', 'cancelled', 'pending'
    price_inr NUMERIC(10, 2) NOT NULL DEFAULT 4999,
    start_date TIMESTAMP DEFAULT now() NOT NULL,
    end_date TIMESTAMP,
    trial_days_used INTEGER DEFAULT 0,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_method TEXT, -- 'razorpay', 'manual', 'free'
    invoice_number TEXT,
    invoice_url TEXT,
    auto_renew BOOLEAN DEFAULT false,
    renewal_reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE company_subscriptions IS 'Company subscription and billing records - ₹4,999/year';

CREATE INDEX idx_company_subscriptions_company_id ON company_subscriptions(company_id);
CREATE INDEX idx_company_subscriptions_status ON company_subscriptions(status);
CREATE INDEX idx_company_subscriptions_end_date ON company_subscriptions(end_date);

-- ============ JOB POSTS TABLE ============
-- Jobs and internships posted by companies
CREATE TABLE job_posts (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    role_type TEXT NOT NULL, -- 'full-time', 'part-time', 'internship', 'freelance', 'contract'
    category TEXT, -- Job category: 'engineering', 'marketing', 'design', 'sales', 'hr', etc.
    is_paid BOOLEAN NOT NULL DEFAULT false, -- Paid job vs unpaid internship
    salary_min NUMERIC(10, 2),
    salary_max NUMERIC(10, 2),
    salary_currency TEXT DEFAULT 'INR',
    salary_period TEXT DEFAULT 'monthly', -- 'monthly', 'yearly', 'hourly', 'stipend'
    experience_level TEXT NOT NULL, -- 'fresher', 'entry-level', 'mid-level', 'senior', 'lead'
    experience_min INTEGER, -- Min years of experience
    experience_max INTEGER, -- Max years of experience
    location_type TEXT NOT NULL, -- 'onsite', 'remote', 'hybrid'
    city TEXT,
    state TEXT,
    country TEXT DEFAULT 'India',
    pincode TEXT,
    working_days TEXT, -- 'Mon-Fri', 'Mon-Sat', 'Flexible'
    working_hours TEXT, -- '9 AM - 6 PM', 'Flexible'
    is_flexible BOOLEAN DEFAULT false,
    description TEXT NOT NULL,
    responsibilities TEXT, -- Key responsibilities
    required_skills JSONB, -- Array of required skills
    preferred_qualifications TEXT,
    education_requirement TEXT, -- Required education level
    benefits JSONB, -- Array of benefits
    number_of_openings INTEGER DEFAULT 1,
    application_deadline TIMESTAMP,
    start_date TIMESTAMP, -- Expected start date
    duration TEXT, -- For internships: '3 months', '6 months'
    documents_required JSONB, -- Array of required documents
    screening_questions JSONB, -- Custom screening questions
    visibility TEXT NOT NULL DEFAULT 'standard', -- 'standard', 'featured', 'urgent'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'active', 'closed', 'expired', 'rejected', 'draft'
    admin_approved BOOLEAN DEFAULT false, -- Admin approval required
    admin_notes TEXT, -- Admin notes
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

COMMENT ON TABLE job_posts IS 'Job and internship listings - ₹199 platform fee for 6 months visibility';

CREATE INDEX idx_job_posts_company_id ON job_posts(company_id);
CREATE INDEX idx_job_posts_status ON job_posts(status);
CREATE INDEX idx_job_posts_role_type ON job_posts(role_type);
CREATE INDEX idx_job_posts_location_type ON job_posts(location_type);
CREATE INDEX idx_job_posts_category ON job_posts(category);
CREATE INDEX idx_job_posts_slug ON job_posts(slug);
CREATE INDEX idx_job_posts_created_at ON job_posts(created_at DESC);
CREATE INDEX idx_job_posts_published_at ON job_posts(published_at DESC);
CREATE INDEX idx_job_posts_admin_approved ON job_posts(admin_approved);
CREATE INDEX idx_job_posts_city ON job_posts(city);
CREATE INDEX idx_job_posts_experience_level ON job_posts(experience_level);

-- ============ JOB POST PAYMENTS TABLE ============
-- Payment records for paid job listings (₹199 platform fee)
CREATE TABLE job_post_payments (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    job_post_id VARCHAR(36) NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    amount_inr NUMERIC(10, 2) NOT NULL DEFAULT 199,
    gst_amount NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 199,
    payment_type TEXT NOT NULL DEFAULT 'platform_fee', -- 'platform_fee', 'featured_upgrade', 'renewal'
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    payment_method TEXT,
    valid_until TIMESTAMP, -- 6 months visibility
    invoice_number TEXT,
    invoice_url TEXT,
    refund_reason TEXT,
    refunded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE job_post_payments IS 'Payment records for ₹199 platform fee (6 months visibility)';

CREATE INDEX idx_job_post_payments_job_id ON job_post_payments(job_post_id);
CREATE INDEX idx_job_post_payments_company_id ON job_post_payments(company_id);
CREATE INDEX idx_job_post_payments_status ON job_post_payments(status);

-- ============ JOB APPLICATIONS TABLE ============
-- Student/candidate applications with CV upload
CREATE TABLE job_applications (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
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
    current_ctc NUMERIC(10, 2), -- Current salary
    expected_ctc NUMERIC(10, 2), -- Expected salary
    notice_period TEXT, -- 'immediate', '15 days', '1 month', '2 months', '3 months'
    preferred_hours TEXT,
    available_start_date TIMESTAMP,
    cv_url TEXT NOT NULL, -- Uploaded CV from Supabase storage
    cv_file_name TEXT,
    cv_uploaded_at TIMESTAMP DEFAULT now(),
    portfolio_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    cover_note TEXT,
    screening_answers JSONB, -- Answers to screening questions
    bank_details_consent BOOLEAN DEFAULT false,
    bank_account_number TEXT,
    bank_ifsc_code TEXT,
    bank_holder_name TEXT,
    status TEXT NOT NULL DEFAULT 'applied', -- 'applied', 'reviewed', 'shortlisted', 'interview', 'offered', 'hired', 'rejected', 'withdrawn'
    status_history JSONB DEFAULT '[]', -- Track status changes
    company_notes TEXT, -- Internal notes by company
    candidate_rating INTEGER, -- 1-5 rating by company
    interview_date TIMESTAMP,
    interview_notes TEXT,
    offer_amount NUMERIC(10, 2),
    offer_date TIMESTAMP,
    rejection_reason TEXT,
    last_viewed_by_company TIMESTAMP,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    updated_at TIMESTAMP DEFAULT now() NOT NULL
);

COMMENT ON TABLE job_applications IS 'Student/candidate applications with CV upload and status tracking';

CREATE INDEX idx_job_applications_job_post_id ON job_applications(job_post_id);
CREATE INDEX idx_job_applications_company_id ON job_applications(company_id);
CREATE INDEX idx_job_applications_candidate_id ON job_applications(candidate_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_created_at ON job_applications(created_at DESC);
CREATE UNIQUE INDEX idx_job_applications_unique ON job_applications(job_post_id, candidate_id);

-- ============ SAVED JOBS TABLE ============
-- Jobs saved/bookmarked by students
CREATE TABLE saved_jobs (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    job_post_id VARCHAR(36) NOT NULL REFERENCES job_posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    UNIQUE(user_id, job_post_id)
);

COMMENT ON TABLE saved_jobs IS 'Jobs saved/bookmarked by students (heart icon)';

CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_post_id ON saved_jobs(job_post_id);

-- ============ SAVED COMPANIES TABLE ============
-- Companies followed by users
CREATE TABLE saved_companies (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT now() NOT NULL,
    UNIQUE(user_id, company_id)
);

COMMENT ON TABLE saved_companies IS 'Companies followed by users';

CREATE INDEX idx_saved_companies_user_id ON saved_companies(user_id);
CREATE INDEX idx_saved_companies_company_id ON saved_companies(company_id);

-- ============ CV DOWNLOAD LOGS TABLE ============
-- Track when companies download candidate CVs
CREATE TABLE cv_download_logs (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    application_id VARCHAR(36) NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    job_post_id VARCHAR(36) NOT NULL,
    company_id VARCHAR(36) NOT NULL,
    downloaded_by VARCHAR(36) NOT NULL, -- User who downloaded
    downloaded_at TIMESTAMP DEFAULT now() NOT NULL,
    ip_address TEXT,
    user_agent TEXT
);

COMMENT ON TABLE cv_download_logs IS 'Track CV downloads for compliance and analytics';

CREATE INDEX idx_cv_download_logs_application_id ON cv_download_logs(application_id);
CREATE INDEX idx_cv_download_logs_company_id ON cv_download_logs(company_id);
CREATE INDEX idx_cv_download_logs_downloaded_at ON cv_download_logs(downloaded_at DESC);

-- ============ OPPORTUNITY NOTIFICATIONS TABLE ============
-- Notifications specific to opportunities feature
CREATE TABLE opportunity_notifications (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    type TEXT NOT NULL, -- 'new_application', 'application_status', 'company_verified', 'job_approved', 'subscription_expiry', 'trial_ending'
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

COMMENT ON TABLE opportunity_notifications IS 'Notifications for opportunities feature';

CREATE INDEX idx_opportunity_notifications_user_id ON opportunity_notifications(user_id);
CREATE INDEX idx_opportunity_notifications_read ON opportunity_notifications(read);
CREATE INDEX idx_opportunity_notifications_type ON opportunity_notifications(type);
CREATE INDEX idx_opportunity_notifications_created_at ON opportunity_notifications(created_at DESC);

-- ============ FUNCTIONS ============

-- Function to increment view count
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

-- Auto-update timestamps
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

CREATE TRIGGER update_company_subscriptions_updated_at
    BEFORE UPDATE ON company_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update stats
CREATE TRIGGER update_company_job_count
    AFTER INSERT OR DELETE ON job_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_company_job_stats();

CREATE TRIGGER update_job_app_count
    AFTER INSERT OR DELETE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_job_application_count();

-- ============ ROW LEVEL SECURITY (RLS) ============

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_post_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_download_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunity_notifications ENABLE ROW LEVEL SECURITY;

-- Service role full access (for backend)
CREATE POLICY "Service role full access - companies" ON companies FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - company_subscriptions" ON company_subscriptions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - job_posts" ON job_posts FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - job_post_payments" ON job_post_payments FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - job_applications" ON job_applications FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - saved_jobs" ON saved_jobs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - saved_companies" ON saved_companies FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - cv_download_logs" ON cv_download_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access - opportunity_notifications" ON opportunity_notifications FOR ALL USING (auth.role() = 'service_role');

-- Public read access for active content
CREATE POLICY "Public view active jobs" ON job_posts FOR SELECT USING (status = 'active' AND admin_approved = true);
CREATE POLICY "Public view verified companies" ON companies FOR SELECT USING (status = 'active');

-- ============ CONFIRMATION ============
SELECT 'Opportunities full schema created successfully!' as message;
SELECT 'Tables created: companies, company_subscriptions, job_posts, job_post_payments, job_applications, saved_jobs, saved_companies, cv_download_logs, opportunity_notifications' as info;

-- ============================================================
-- SUPABASE STORAGE BUCKETS - Run in Storage Settings
-- ============================================================
-- Go to Supabase Dashboard > Storage > Create a new bucket:
--
-- 1. BUCKET: cvs
--    - Name: cvs
--    - Public: Yes (for easy download)
--    - Allowed MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
--    - Max file size: 5MB
--
-- 2. BUCKET: company-logos
--    - Name: company-logos
--    - Public: Yes
--    - Allowed MIME types: image/jpeg, image/png, image/webp, image/svg+xml
--    - Max file size: 2MB
--
-- 3. BUCKET: company-docs
--    - Name: company-docs
--    - Public: No (private - registration documents)
--    - Allowed MIME types: application/pdf, image/jpeg, image/png
--    - Max file size: 10MB
--
-- Storage Policies (run in SQL Editor after creating buckets):
/*
-- CVs bucket policies
CREATE POLICY "Anyone can upload CVs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'cvs');

CREATE POLICY "Anyone can download CVs" ON storage.objects
    FOR SELECT USING (bucket_id = 'cvs');

-- Company logos bucket policies
CREATE POLICY "Anyone can upload logos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'company-logos');

CREATE POLICY "Anyone can view logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'company-logos');

-- Company docs bucket policies (private)
CREATE POLICY "Service role can manage company docs" ON storage.objects
    FOR ALL USING (bucket_id = 'company-docs' AND auth.role() = 'service_role');
*/
-- ============================================================
