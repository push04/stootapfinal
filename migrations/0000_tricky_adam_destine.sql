CREATE TABLE "cart_items" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" text NOT NULL,
	"service_id" varchar NOT NULL,
	"qty" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
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
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"role" text DEFAULT 'business' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
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
