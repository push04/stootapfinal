# Stootap Database Schema for Supabase

This directory contains the complete database schema for the Stootap business services platform, compatible with Supabase PostgreSQL.

## Files

- `schema.sql` - Complete database schema with all tables and constraints
- `README.md` - This file with setup instructions

## Quick Start

### 1. Set Up Supabase Project

1. Go to https://supabase.com
2. Create a new project
3. Note down your database password
4. Wait for project to finish provisioning

### 2. Import Schema

**Option A: Using Supabase Dashboard (Recommended)**

1. Open your Supabase project
2. Navigate to SQL Editor
3. Click "New Query"
4. Copy contents of `schema.sql` and paste into editor
5. Click "Run" to execute

**Option B: Using PostgreSQL Client**

```bash
psql "postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < schema.sql
```

### 3. Verify Installation

Run this query in SQL Editor to verify all tables:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- cart_items
- categories
- leads
- order_items
- orders
- profiles
- services

## Database Schema Overview

### Tables

#### profiles
User accounts with role-based access
- **id:** UUID primary key
- **full_name:** User's full name
- **email:** Unique email address
- **phone:** Contact phone number
- **role:** User role (student/business)
- **created_at:** Account creation timestamp

#### categories
Service categories for organization
- **id:** UUID primary key
- **slug:** URL-friendly identifier (unique)
- **name:** Display name
- **description:** Category description
- **sort_order:** Display order
- **created_at:** Creation timestamp

#### services
Available business services catalog
- **id:** UUID primary key
- **category_id:** Reference to categories
- **slug:** URL-friendly identifier (unique)
- **name:** Service name
- **summary:** Brief description
- **long_description:** Detailed description
- **base_price_inr:** Price in Indian Rupees
- **sku:** Stock keeping unit
- **eta_days:** Estimated time to complete
- **icon:** Lucide icon name
- **active:** Service availability status
- **problem:** Problem this service solves
- **outcome:** Expected outcome
- **includes:** What's included
- **prerequisites:** Requirements
- **timeline:** Delivery timeline
- **faqs:** Frequently asked questions (JSONB)
- **created_at:** Creation timestamp

#### orders
Customer orders
- **id:** UUID primary key
- **user_id:** Reference to profiles (optional)
- **session_id:** Guest session identifier (optional)
- **status:** Order status (pending/processing/completed/cancelled)
- **subtotal_inr:** Subtotal amount
- **gst_inr:** GST/tax amount
- **total_inr:** Total amount
- **razorpay_order_id:** Payment gateway order ID
- **razorpay_payment_id:** Payment gateway payment ID
- **razorpay_signature:** Payment verification signature
- **customer_name:** Customer name
- **customer_email:** Customer email
- **customer_phone:** Customer phone
- **customer_address:** Customer address
- **created_at:** Order creation timestamp

#### order_items
Line items for each order
- **id:** UUID primary key
- **order_id:** Reference to orders
- **service_id:** Reference to services
- **name:** Service name snapshot
- **unit_price_inr:** Price per unit
- **qty:** Quantity ordered
- **total_inr:** Line total
- **created_at:** Creation timestamp

#### leads
Captured leads from contact forms
- **id:** UUID primary key
- **user_id:** Reference to profiles (optional)
- **name:** Lead name
- **email:** Lead email
- **phone:** Lead phone
- **role:** Lead role/type
- **message:** Lead message
- **kind:** Lead type (general/inquiry)
- **captured_via:** Source (web_form/chat/etc)
- **metadata:** Additional data (JSONB)
- **created_at:** Capture timestamp

#### cart_items
Shopping cart persistence
- **id:** UUID primary key
- **session_id:** Session identifier
- **service_id:** Reference to services
- **qty:** Quantity
- **created_at:** Addition timestamp

## Row Level Security (RLS)

For production Supabase deployment, consider enabling RLS:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

## Seeding Data

The application automatically seeds:
- 8 service categories
- 50+ business services

This happens on first server startup. No manual seeding required.

## Connection String

Get your connection string from Supabase Dashboard:

1. Project Settings → Database
2. Connection string → URI
3. Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

Use this as `DATABASE_URL` environment variable.

## Migrations

This schema is generated from Drizzle ORM. Future schema changes can be managed with:

```bash
npx drizzle-kit generate
npx drizzle-kit push
```

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs
- Drizzle ORM Docs: https://orm.drizzle.team
