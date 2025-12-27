# Stootap Database Schema for Supabase

This directory contains the complete database schema for the Stootap business services platform, compatible with Supabase PostgreSQL.

## Files

| File | Description |
|------|-------------|
| `schema.sql` | Main Stootap schema (core tables) |
| `opportunities_full_schema.sql` | **RECOMMENDED** - Complete Opportunities/Jobs schema |
| `opportunities_full_seed_data.sql` | Sample data with 6 companies and 12 jobs |
| `opportunities_complete_schema.sql` | Original opportunities schema |
| `opportunities_seed_data.sql` | Original seed data |

---

## Quick Start - Opportunities Feature

### Step 1: Run the Schema

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy contents of `opportunities_full_schema.sql`
3. Click **Run** to execute

### Step 2: Create Storage Buckets

Go to **Supabase Dashboard** → **Storage** → **Create a new bucket**:

| Bucket Name | Public | Purpose | Max Size |
|-------------|--------|---------|----------|
| `cvs` | Yes | Resume uploads | 5MB |
| `company-logos` | Yes | Company logos | 2MB |
| `company-docs` | No | Registration docs | 10MB |

### Step 3: Add Sample Data (Optional)

Run `opportunities_full_seed_data.sql` in SQL Editor.

---

## Opportunities Database Tables

### Core Tables

1. **companies** - Self-registered companies that post jobs
2. **company_subscriptions** - Subscription billing (₹4,999/year after 60-day trial)
3. **job_posts** - Job and internship listings
4. **job_post_payments** - Platform fee payments (₹199 for 6 months)
5. **job_applications** - Student applications with CV
6. **saved_jobs** - Bookmarked jobs by students
7. **saved_companies** - Followed companies
8. **cv_download_logs** - Track CV downloads
9. **opportunity_notifications** - Notifications for this feature

### Pricing Model

| Feature | Price | Duration |
|---------|-------|----------|
| Company Trial | FREE | 60 days |
| Company Subscription | ₹4,999 | Per year |
| Paid Job Listing | ₹199 | 6 months visibility |
| Unpaid Internship | FREE | Standard visibility |

---

## API Endpoints

### Public
- `GET /api/opportunities/jobs` - List jobs
- `GET /api/opportunities/jobs/:slug` - Job details
- `GET /api/opportunities/companies` - List companies

### Company (Auth Required)
- `POST /api/opportunities/companies` - Register
- `GET/PUT /api/opportunities/my-company` - Profile
- `POST/PUT/DELETE /api/opportunities/jobs/:id` - Manage jobs
- `GET /api/opportunities/jobs/:id/applications` - View applicants
- `PATCH /api/opportunities/applications/:id/status` - Update status

### Candidate (Auth Required)
- `POST /api/opportunities/jobs/:id/apply` - Apply
- `GET /api/opportunities/my-applications` - My apps
- `POST/DELETE /api/opportunities/jobs/:id/save` - Save/unsave

### Payments
- `POST /api/opportunities/jobs/:id/pay` - Platform fee
- `POST /api/opportunities/subscription/pay` - Subscription

---

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/opportunities` | Browse jobs |
| `/opportunities/:slug` | Job details |
| `/company/register` | Company registration |
| `/company/dashboard` | Company panel |
| `/candidate/dashboard` | Student dashboard |

---

## Original Stootap Schema

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

---

## Storage Bucket Policies

Run after creating buckets:

```sql
-- CVs bucket
CREATE POLICY "Anyone can upload CVs" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'cvs');
CREATE POLICY "Anyone can download CVs" ON storage.objects
    FOR SELECT USING (bucket_id = 'cvs');

-- Company logos
CREATE POLICY "Anyone can upload logos" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'company-logos');
CREATE POLICY "Anyone can view logos" ON storage.objects
    FOR SELECT USING (bucket_id = 'company-logos');

-- Company docs (private)
CREATE POLICY "Service role manages docs" ON storage.objects
    FOR ALL USING (bucket_id = 'company-docs' AND auth.role() = 'service_role');
```

---

## Connection

Get your connection string from Supabase Dashboard:
1. Project Settings → Database
2. Connection string → URI
3. Use as `DATABASE_URL` environment variable

## Support

- Supabase Docs: https://supabase.com/docs
- Drizzle ORM Docs: https://orm.drizzle.team
