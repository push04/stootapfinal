-- ==============================================================================
-- STOOTAP SUPABASE SEED SCRIPT
-- ==============================================================================
-- ⚠️ WARNING: This script will WIPE all existing data in the 'public' schema.
-- Use this to reset your database and populate it with Stootap seed data.
-- ==============================================================================

-- 1. CLEANUP (Drop existing tables)
DROP TABLE IF EXISTS "cv_download_logs" CASCADE;
DROP TABLE IF EXISTS "saved_companies" CASCADE;
DROP TABLE IF EXISTS "saved_jobs" CASCADE;
DROP TABLE IF EXISTS "job_applications" CASCADE;
DROP TABLE IF EXISTS "job_post_payments" CASCADE;
DROP TABLE IF EXISTS "job_posts" CASCADE;
DROP TABLE IF EXISTS "company_subscriptions" CASCADE;
DROP TABLE IF EXISTS "companies" CASCADE;
DROP TABLE IF EXISTS "site_content" CASCADE;
DROP TABLE IF EXISTS "user_subscriptions" CASCADE;
DROP TABLE IF EXISTS "subscription_plans" CASCADE;
DROP TABLE IF EXISTS "audit_logs" CASCADE;
DROP TABLE IF EXISTS "ticket_replies" CASCADE;
DROP TABLE IF EXISTS "tickets" CASCADE;
DROP TABLE IF EXISTS "documents" CASCADE;
DROP TABLE IF EXISTS "notification_preferences" CASCADE;
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "cart_items" CASCADE;
DROP TABLE IF EXISTS "leads" CASCADE;
DROP TABLE IF EXISTS "order_items" CASCADE;
DROP TABLE IF EXISTS "orders" CASCADE;
DROP TABLE IF EXISTS "services" CASCADE;
DROP TABLE IF EXISTS "categories" CASCADE;
DROP TABLE IF EXISTS "profiles" CASCADE;

-- 2. SCHEMA DEFINITION
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"full_name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"phone" text,
	"role" text DEFAULT 'business' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "services" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
	"category_id" varchar NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"name" text NOT NULL,
	"summary" text NOT NULL,
	"long_description" text,
	"base_price_inr" numeric(10, 2) NOT NULL,
	"sku" text,
	"eta_days" integer NOT NULL,
	"icon" text DEFAULT 'Package',
	"active" boolean DEFAULT true,
	"problem" text,
	"outcome" text,
	"includes" text,
	"prerequisites" text,
	"timeline" text,
	"faqs" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);

-- (Create other tables for completeness - Orders, Jobs, Companies etc.)

CREATE TABLE IF NOT EXISTS "orders" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar,
    "session_id" text,
    "status" text DEFAULT 'pending' NOT NULL,
    "subtotal_inr" numeric(10, 2) NOT NULL,
    "gst_inr" numeric(10, 2) NOT NULL,
    "total_inr" numeric(10, 2) NOT NULL,
    "razorpay_order_id" text,
    "razorpay_payment_id" text,
    "razorpay_signature" text,
    "customer_name" text,
    "customer_email" text,
    "customer_phone" text,
    "customer_address" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "order_items" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" varchar NOT NULL,
    "service_id" varchar NOT NULL,
    "name" text NOT NULL,
    "unit_price_inr" numeric(10, 2) NOT NULL,
    "qty" integer DEFAULT 1 NOT NULL,
    "total_inr" numeric(10, 2) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "leads" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar,
    "name" text NOT NULL,
    "email" text NOT NULL,
    "phone" text NOT NULL,
    "role" text NOT NULL,
    "message" text NOT NULL,
    "kind" text DEFAULT 'general',
    "captured_via" text DEFAULT 'web_form',
    "metadata" jsonb,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cart_items" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "session_id" text NOT NULL,
    "service_id" varchar NOT NULL,
    "qty" integer DEFAULT 1 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar NOT NULL,
    "type" text NOT NULL,
    "title" text NOT NULL,
    "message" text NOT NULL,
    "action_url" text,
    "read" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "notification_preferences" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar NOT NULL UNIQUE,
    "email_order_paid" boolean DEFAULT true,
    "email_subscription_activated" boolean DEFAULT true,
    "email_invoice_available" boolean DEFAULT true,
    "email_ticket_reply" boolean DEFAULT true,
    "in_app_order_paid" boolean DEFAULT true,
    "in_app_subscription_activated" boolean DEFAULT true,
    "in_app_invoice_available" boolean DEFAULT true,
    "in_app_ticket_reply" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "documents" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "order_id" varchar NOT NULL,
    "uploaded_by" varchar NOT NULL,
    "uploader_role" text NOT NULL,
    "file_name" text NOT NULL,
    "file_url" text NOT NULL,
    "file_type" text NOT NULL,
    "file_size" integer NOT NULL,
    "version" integer DEFAULT 1,
    "category" text NOT NULL,
    "notes" text,
    "scan_status" text DEFAULT 'pending',
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "tickets" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar NOT NULL,
    "order_id" varchar,
    "category" text NOT NULL,
    "subject" text NOT NULL,
    "status" text DEFAULT 'open' NOT NULL,
    "priority" text DEFAULT 'medium',
    "assigned_to" varchar,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "ticket_replies" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "ticket_id" varchar NOT NULL,
    "user_id" varchar NOT NULL,
    "user_role" text NOT NULL,
    "message" text NOT NULL,
    "is_internal" boolean DEFAULT false,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar NOT NULL,
    "action" text NOT NULL,
    "resource_type" text NOT NULL,
    "resource_id" varchar,
    "details" jsonb,
    "ip_address" text,
    "user_agent" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "subscription_plans" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" text NOT NULL,
    "description" text,
    "price_inr" numeric(10, 2) NOT NULL,
    "billing_interval" text NOT NULL,
    "features" jsonb,
    "active" boolean DEFAULT true,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "user_subscriptions" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar NOT NULL,
    "plan_id" varchar NOT NULL,
    "status" text DEFAULT 'active' NOT NULL,
    "start_date" timestamp DEFAULT now() NOT NULL,
    "end_date" timestamp,
    "razorpay_subscription_id" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "site_content" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "key" text NOT NULL UNIQUE,
    "section" text NOT NULL,
    "label" text NOT NULL,
    "value" text NOT NULL,
    "type" text DEFAULT 'text' NOT NULL,
    "description" text,
    "sort_order" integer DEFAULT 0,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "saved_jobs" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar NOT NULL,
    "job_post_id" varchar NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "saved_companies" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" varchar NOT NULL,
    "company_id" varchar NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "cv_download_logs" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "application_id" varchar NOT NULL,
    "downloaded_by" varchar NOT NULL,
    "downloaded_at" timestamp DEFAULT now() NOT NULL,
    "ip_address" text
);

CREATE TABLE IF NOT EXISTS "company_subscriptions" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_id" varchar NOT NULL,
    "plan_type" text DEFAULT 'featured' NOT NULL,
    "status" text DEFAULT 'trial' NOT NULL,
    "price_inr" numeric(10, 2) DEFAULT '4999' NOT NULL,
    "start_date" timestamp DEFAULT now() NOT NULL,
    "end_date" timestamp,
    "razorpay_order_id" text,
    "razorpay_payment_id" text,
    "razorpay_signature" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);


CREATE TABLE IF NOT EXISTS "companies" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
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
    "status" text DEFAULT 'active' NOT NULL,
    "trial_start_date" timestamp,
    "trial_end_date" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "job_posts" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "company_id" varchar NOT NULL,
    "title" text NOT NULL,
    "slug" text NOT NULL UNIQUE,
    "role_type" text NOT NULL,
    "is_paid" boolean DEFAULT false NOT NULL,
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
    "visibility" text DEFAULT 'standard' NOT NULL,
    "status" text DEFAULT 'active' NOT NULL,
    "platform_fee_paid" boolean DEFAULT false,
    "featured_until" timestamp,
    "view_count" integer DEFAULT 0,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "job_post_payments" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
    "job_post_id" varchar NOT NULL,
    "company_id" varchar NOT NULL,
    "amount_inr" numeric(10, 2) DEFAULT '199' NOT NULL,
    "payment_type" text DEFAULT 'platform_fee' NOT NULL,
    "status" text DEFAULT 'pending' NOT NULL,
    "razorpay_order_id" text,
    "razorpay_payment_id" text,
    "razorpay_signature" text,
    "valid_until" timestamp,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "job_applications" (
    "id" varchar PRIMARY KEY DEFAULT gen_random_uuid(),
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
    "status" text DEFAULT 'applied' NOT NULL,
    "company_notes" text,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

-- 3. SEED DTA

-- Categories
INSERT INTO "categories" ("id", "name", "slug", "description") VALUES
('cat_legal', 'Legal & Compliance', 'legal-compliance', 'Registration, licenses, and legal documentation'),
('cat_tax', 'Tax & Accounting', 'tax-accounting', 'GST, income tax, and bookkeeping services'),
('cat_marketing', 'Digital Marketing', 'digital-marketing', 'SEO, social media, and paid ads'),
('cat_tech', 'Technology & Dev', 'technology-dev', 'Website, app development and IT support'),
('cat_design', 'Design & Creative', 'design-creative', 'Logo, branding, and graphic design'),
('cat_content', 'Content & Writing', 'content-writing', 'Blogs, copywriting, and translation'),
('cat_hr', 'HR & Staffing', 'hr-staffing', 'Recruitment, payroll, and HR policies'),
('cat_business', 'Business Consulting', 'business-consulting', 'Strategy, planning, and funding assistance')
ON CONFLICT ("slug") DO NOTHING;

-- Services (Sampling of ~20 core services for brevity in this file, use loop for more if needed)
INSERT INTO "services" ("category_id", "name", "slug", "summary", "base_price_inr", "eta_days") VALUES
('cat_legal', 'Private Limited Company Registration', 'private-limited-company-registration', 'Register your Pvt Ltd company.', 14999, 15),
('cat_legal', 'LLP Registration', 'llp-registration', 'Limited Liability Partnership registration.', 7999, 10),
('cat_legal', 'Trademark Registration', 'trademark-registration', 'Protect your brand name/logo.', 4999, 3),
('cat_tax', 'GST Registration', 'gst-registration', 'Get your GSTIN number.', 1499, 5),
('cat_tax', 'Income Tax Return (Business)', 'itr-business', 'File your business ITR.', 2499, 3),
('cat_marketing', 'SEO Basic Package', 'seo-basic', 'Improve your Google ranking.', 9999, 30),
('cat_tech', 'WordPress Website', 'wordpress-website', 'Business website development.', 14999, 7),
('cat_tech', 'E-commerce App', 'ecommerce-app', 'Mobile app for your store.', 49999, 45)
ON CONFLICT ("slug") DO NOTHING;

-- Add remaining tables creation if needed...
-- For full robustness, verify foreign keys are respected (e.g. category_id).

-- Dummy Company
-- Note: 'user_id' usually links to auth.users. 
-- For seeding testing, we can use a dummy UUID. The app logic handles "if user exists".
INSERT INTO "companies" 
("id", "user_id", "company_name", "contact_name", "contact_email", "business_type", "verified", "status") 
VALUES 
('comp_dummy', 'user_dummy_uuid', 'TechCorp Innovations', 'John Doe', 'hr@techcorp.com', 'Technology', true, 'active')
ON CONFLICT DO NOTHING;

INSERT INTO "job_posts" 
("company_id", "title", "slug", "role_type", "experience_level", "location_type", "description", "salary_min", "salary_max")
VALUES
('comp_dummy', 'Frontend Developer', 'frontend-dev-01', 'full-time', 'Entry', 'Remote', 'React developer needed.', 500000, 800000),
('comp_dummy', 'Marketing Manager', 'marketing-mgr-01', 'full-time', 'Mid', 'Hybrid', 'Lead our marketing.', 800000, 1200000)
ON CONFLICT ("slug") DO NOTHING;
