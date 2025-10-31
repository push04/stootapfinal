-- Stootap Complete Database Schema for Supabase
-- Generated: October 31, 2025
-- All tables with proper UUID generation and timestamps

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table
CREATE TABLE "profiles" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "full_name" text NOT NULL,
        "email" text NOT NULL,
        "phone" text,
        "role" text DEFAULT 'business' NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "profiles_email_unique" UNIQUE("email")
);

-- Categories table
CREATE TABLE "categories" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "slug" text NOT NULL,
        "name" text NOT NULL,
        "description" text,
        "sort_order" integer DEFAULT 0,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);

-- Services table
CREATE TABLE "services" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "category_id" varchar NOT NULL,
        "slug" text NOT NULL,
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
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "services_slug_unique" UNIQUE("slug")
);

-- Orders table
CREATE TABLE "orders" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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

-- Order Items table
CREATE TABLE "order_items" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "order_id" varchar NOT NULL,
        "service_id" varchar NOT NULL,
        "name" text NOT NULL,
        "unit_price_inr" numeric(10, 2) NOT NULL,
        "qty" integer DEFAULT 1 NOT NULL,
        "total_inr" numeric(10, 2) NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);

-- Leads table
CREATE TABLE "leads" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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

-- Cart Items table
CREATE TABLE "cart_items" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "session_id" text NOT NULL,
        "service_id" varchar NOT NULL,
        "qty" integer DEFAULT 1 NOT NULL,
        "created_at" timestamp DEFAULT now() NOT NULL
);

-- Notifications table
CREATE TABLE "notifications" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" varchar NOT NULL,
        "type" text NOT NULL,
        "title" text NOT NULL,
        "message" text NOT NULL,
        "action_url" text,
        "read" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now() NOT NULL
);

-- Notification Preferences table
CREATE TABLE "notification_preferences" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" varchar NOT NULL,
        "email_order_paid" boolean DEFAULT true,
        "email_subscription_activated" boolean DEFAULT true,
        "email_invoice_available" boolean DEFAULT true,
        "email_ticket_reply" boolean DEFAULT true,
        "in_app_order_paid" boolean DEFAULT true,
        "in_app_subscription_activated" boolean DEFAULT true,
        "in_app_invoice_available" boolean DEFAULT true,
        "in_app_ticket_reply" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now() NOT NULL,
        CONSTRAINT "notification_preferences_user_id_unique" UNIQUE("user_id")
);

-- Documents table
CREATE TABLE "documents" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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

-- Tickets table
CREATE TABLE "tickets" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
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

-- Ticket Replies table
CREATE TABLE "ticket_replies" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "ticket_id" varchar NOT NULL,
        "user_id" varchar NOT NULL,
        "user_role" text NOT NULL,
        "message" text NOT NULL,
        "is_internal" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now() NOT NULL
);

-- Audit Logs table
CREATE TABLE "audit_logs" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" varchar NOT NULL,
        "action" text NOT NULL,
        "resource_type" text NOT NULL,
        "resource_id" varchar,
        "details" jsonb,
        "ip_address" text,
        "user_agent" text,
        "created_at" timestamp DEFAULT now() NOT NULL
);

-- Subscription Plans table
CREATE TABLE "subscription_plans" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "name" text NOT NULL,
        "description" text,
        "price_inr" numeric(10, 2) NOT NULL,
        "billing_interval" text NOT NULL,
        "features" jsonb,
        "active" boolean DEFAULT true,
        "created_at" timestamp DEFAULT now() NOT NULL
);

-- User Subscriptions table
CREATE TABLE "user_subscriptions" (
        "id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "user_id" varchar NOT NULL,
        "plan_id" varchar NOT NULL,
        "status" text DEFAULT 'active' NOT NULL,
        "start_date" timestamp DEFAULT now() NOT NULL,
        "end_date" timestamp,
        "razorpay_subscription_id" text,
        "created_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_services_category_id ON services(category_id);
CREATE INDEX idx_services_active ON services(active);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_session_id ON orders(session_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_cart_items_session_id ON cart_items(session_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- Add comments for documentation
COMMENT ON TABLE profiles IS 'User profiles for customers and businesses';
COMMENT ON TABLE categories IS 'Service categories for organization';
COMMENT ON TABLE services IS 'All available services with pricing and details';
COMMENT ON TABLE orders IS 'Customer orders with payment information';
COMMENT ON TABLE order_items IS 'Line items for each order';
COMMENT ON TABLE leads IS 'Contact form submissions and lead capture';
COMMENT ON TABLE cart_items IS 'Shopping cart items (session-based)';
COMMENT ON TABLE notifications IS 'User notifications for app events';
COMMENT ON TABLE documents IS 'Order-related documents and uploads';
COMMENT ON TABLE tickets IS 'Customer support tickets';
COMMENT ON TABLE audit_logs IS 'System audit trail for compliance';
COMMENT ON TABLE subscription_plans IS 'Available subscription tiers';
COMMENT ON TABLE user_subscriptions IS 'Active user subscriptions';
