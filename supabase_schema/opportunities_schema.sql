-- Stootap Opportunities & Company Listings Schema for Supabase
-- Run this AFTER the main schema.sql has been executed
-- This adds tables for job listings and company management

-- ============ OPPORTUNITIES & COMPANY LISTINGS TABLES ============

-- Companies table
CREATE TABLE IF NOT EXISTS "companies" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" varchar NOT NULL,
    "company_name" text NOT NULL,
    "contact_name" text NOT NULL,
    "contact_email" text NOT NULL,
    "phone" text,
    "business_type" text NOT NULL,
    "website_url" text,
    "gstin" text,
    "description" text,
    "city" text,
    "state" text,
    "registration_doc_url" text,
    "logo_url" text,
    "verified" boolean DEFAULT false,
    "status" text NOT NULL DEFAULT 'active',
    "trial_start_date" timestamp,
    "trial_end_date" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Company Subscriptions table
CREATE TABLE IF NOT EXISTS "company_subscriptions" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "company_id" varchar NOT NULL,
    "plan_type" text NOT NULL DEFAULT 'featured',
    "status" text NOT NULL DEFAULT 'trial',
    "price_inr" numeric(10, 2) NOT NULL DEFAULT 4999,
    "start_date" timestamp DEFAULT now() NOT NULL,
    "end_date" timestamp,
    "razorpay_order_id" text,
    "razorpay_payment_id" text,
    "razorpay_signature" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Job Posts table
CREATE TABLE IF NOT EXISTS "job_posts" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "company_id" varchar NOT NULL,
    "title" text NOT NULL,
    "slug" text NOT NULL,
    "role_type" text NOT NULL,
    "is_paid" boolean NOT NULL DEFAULT false,
    "salary_min" numeric(10, 2),
    "salary_max" numeric(10, 2),
    "experience_level" text NOT NULL,
    "location_type" text NOT NULL,
    "city" text,
    "working_days" text,
    "working_hours" text,
    "is_flexible" boolean DEFAULT false,
    "description" text NOT NULL,
    "responsibilities" text,
    "required_skills" jsonb,
    "preferred_qualifications" text,
    "number_of_openings" integer DEFAULT 1,
    "application_deadline" timestamp,
    "documents_required" jsonb,
    "visibility" text NOT NULL DEFAULT 'standard',
    "status" text NOT NULL DEFAULT 'active',
    "platform_fee_paid" boolean DEFAULT false,
    "featured_until" timestamp,
    "view_count" integer DEFAULT 0,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT "job_posts_slug_unique" UNIQUE("slug")
);

-- Job Post Payments table
CREATE TABLE IF NOT EXISTS "job_post_payments" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "job_post_id" varchar NOT NULL,
    "company_id" varchar NOT NULL,
    "amount_inr" numeric(10, 2) NOT NULL DEFAULT 199,
    "payment_type" text NOT NULL DEFAULT 'platform_fee',
    "status" text NOT NULL DEFAULT 'pending',
    "razorpay_order_id" text,
    "razorpay_payment_id" text,
    "razorpay_signature" text,
    "valid_until" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Job Applications table
CREATE TABLE IF NOT EXISTS "job_applications" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "job_post_id" varchar NOT NULL,
    "company_id" varchar NOT NULL,
    "candidate_id" varchar NOT NULL,
    "full_name" text NOT NULL,
    "email" text NOT NULL,
    "phone" text NOT NULL,
    "college_name" text,
    "experience_summary" text,
    "preferred_hours" text,
    "available_start_date" timestamp,
    "cv_url" text NOT NULL,
    "cover_note" text,
    "bank_details_consent" boolean DEFAULT false,
    "bank_account_number" text,
    "bank_ifsc_code" text,
    "status" text NOT NULL DEFAULT 'applied',
    "company_notes" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- Saved Jobs table
CREATE TABLE IF NOT EXISTS "saved_jobs" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" varchar NOT NULL,
    "job_post_id" varchar NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- Saved Companies table
CREATE TABLE IF NOT EXISTS "saved_companies" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "user_id" varchar NOT NULL,
    "company_id" varchar NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

-- CV Download Logs table
CREATE TABLE IF NOT EXISTS "cv_download_logs" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
    "application_id" varchar NOT NULL,
    "downloaded_by" varchar NOT NULL,
    "downloaded_at" timestamp DEFAULT now() NOT NULL,
    "ip_address" text
);

-- Add foreign key constraints
ALTER TABLE company_subscriptions
    ADD CONSTRAINT company_subscriptions_company_id_fkey
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

ALTER TABLE job_posts
    ADD CONSTRAINT job_posts_company_id_fkey
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

ALTER TABLE job_post_payments
    ADD CONSTRAINT job_post_payments_job_post_id_fkey
    FOREIGN KEY (job_post_id) REFERENCES job_posts(id) ON DELETE CASCADE;

ALTER TABLE job_post_payments
    ADD CONSTRAINT job_post_payments_company_id_fkey
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

ALTER TABLE job_applications
    ADD CONSTRAINT job_applications_job_post_id_fkey
    FOREIGN KEY (job_post_id) REFERENCES job_posts(id) ON DELETE CASCADE;

ALTER TABLE job_applications
    ADD CONSTRAINT job_applications_company_id_fkey
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

ALTER TABLE saved_jobs
    ADD CONSTRAINT saved_jobs_job_post_id_fkey
    FOREIGN KEY (job_post_id) REFERENCES job_posts(id) ON DELETE CASCADE;

ALTER TABLE saved_companies
    ADD CONSTRAINT saved_companies_company_id_fkey
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE;

ALTER TABLE cv_download_logs
    ADD CONSTRAINT cv_download_logs_application_id_fkey
    FOREIGN KEY (application_id) REFERENCES job_applications(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(status);
CREATE INDEX IF NOT EXISTS idx_company_subscriptions_company_id ON company_subscriptions(company_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_company_id ON job_posts(company_id);
CREATE INDEX IF NOT EXISTS idx_job_posts_status ON job_posts(status);
CREATE INDEX IF NOT EXISTS idx_job_posts_slug ON job_posts(slug);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_post_id ON job_applications(job_post_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_candidate_id ON job_applications(candidate_id);
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_companies_user_id ON saved_companies(user_id);

-- Function to increment job view count
CREATE OR REPLACE FUNCTION increment_job_view_count(job_id VARCHAR)
RETURNS void AS $$
BEGIN
    UPDATE job_posts SET view_count = view_count + 1 WHERE id = job_id;
END;
$$ LANGUAGE plpgsql;

-- Add comments
COMMENT ON TABLE companies IS 'Registered companies that can post jobs';
COMMENT ON TABLE company_subscriptions IS 'Company subscription and billing records';
COMMENT ON TABLE job_posts IS 'Job and internship listings';
COMMENT ON TABLE job_applications IS 'Student/candidate applications to jobs';
COMMENT ON TABLE saved_jobs IS 'Jobs saved by users for later';
COMMENT ON TABLE saved_companies IS 'Companies followed by users';
