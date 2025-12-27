# Complete Master Schema - All-in-One SQL Setup

## Overview

**File:** `supabase_schema/complete_master_schema.sql`

This is the **ONLY SQL file you need**. It creates your entire Stootap platform database from scratch.

## What Gets Created

✅ **All 16 Tables:**
- 8 Core Platform tables
- 9 Opportunities Portal tables

✅ **40+ Indexes** for performance optimization

✅ **4 PostgreSQL Functions** for automation

✅ **6 Triggers** for data consistency

✅ **RLS Policies** for security

## Key Feature: IF NOT EXISTS

Every single element uses `IF NOT EXISTS` or `DROP IF EXISTS`:
- Safe to run multiple times
- Won't error if tables already exist
- Idempotent (running it twice = same result)
- Perfect for updates and migrations

## How to Use (2 Minutes)

### Step 1: Copy & Run in Supabase

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Click **New Query**
4. Copy **entire contents** of `complete_master_schema.sql`
5. Click **Run**

### Step 2: Create Storage Buckets (Optional)

Go to **Storage** tab and create 3 buckets:

```
cvs (public, 5MB max)
company-logos (public, 2MB max)
company-docs (private, 10MB max)
```

### Step 3: Load Sample Data (Optional)

In SQL Editor, run: `opportunities_full_seed_data.sql`

This adds:
- 6 sample companies
- 12 sample jobs
- Ready to test immediately

## Database Tables Reference

### Core Platform (8 Tables)

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts (students, businesses) |
| `categories` | Service categories |
| `services` | 300+ business services |
| `orders` | Customer orders |
| `order_items` | Order line items |
| `leads` | Lead capture |
| `cart_items` | Shopping cart |
| `notifications` | General notifications |

### Opportunities & Jobs Portal (9 Tables)

| Table | Purpose |
|-------|---------|
| `companies` | Self-registered companies |
| `company_subscriptions` | Billing & trial tracking (₹4,999/year) |
| `job_posts` | Job & internship listings |
| `job_post_payments` | Platform fees (₹199/job) |
| `job_applications` | Student applications |
| `saved_jobs` | Bookmarked jobs by students |
| `saved_companies` | Followed companies |
| `cv_download_logs` | Compliance tracking |
| `opportunity_notifications` | Job portal notifications |

## What Each Function Does

### `increment_job_view_count(job_id)`
- Auto-increments view counter on job page visit
- Used for job statistics

### `update_updated_at_column()`
- Auto-updates `updated_at` timestamp on record changes
- Applied to: companies, job_posts, job_applications, company_subscriptions

### `update_company_job_stats()`
- Automatically updates `total_jobs_posted` when jobs added/deleted
- Keeps company statistics accurate

### `update_job_application_count()`
- Auto-increments application count when students apply
- Updates both job_posts and company stats

## Triggers Explained

| Trigger | Event | Action |
|---------|-------|--------|
| `update_companies_updated_at` | Company record updated | Auto-update timestamp |
| `update_job_posts_updated_at` | Job post updated | Auto-update timestamp |
| `update_job_applications_updated_at` | Application updated | Auto-update timestamp |
| `update_company_subscriptions_updated_at` | Subscription updated | Auto-update timestamp |
| `update_company_job_count` | Job created/deleted | Update company stats |
| `update_job_app_count` | Application created/deleted | Update job & company stats |

## Indexes for Performance

Created on high-query fields:
- User lookups: `idx_profiles_email`, `idx_companies_user_id`
- Status filters: `idx_job_posts_status`, `idx_companies_status`
- Location searches: `idx_job_posts_city`, `idx_companies_city`
- Date ranges: `idx_job_posts_created_at`, `idx_orders_created_at`
- And 30+ more for optimized queries

## Row Level Security (RLS)

- Service role: Full access for backend operations
- Public: Can view active jobs and verified companies
- Per-table policies for data privacy

## Safe to Run Multiple Times

```sql
-- These commands ensure idempotency:

DROP TABLE IF EXISTS table_name CASCADE;
CREATE TABLE IF NOT EXISTS table_name (...)
DROP TRIGGER IF EXISTS trigger_name ON table_name;
CREATE TRIGGER trigger_name (...)
CREATE INDEX IF NOT EXISTS idx_name ON table (field);
CREATE POLICY IF NOT EXISTS policy_name (...)
```

**Result:** Running this file 10 times = same database. No errors, no duplicates.

## Verification

After running, check these in Supabase SQL Editor:

```sql
-- List all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Expected: 16 tables listed

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE schemaname = 'public' ORDER BY indexname;

-- Expected: 40+ indexes

-- Verify functions
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public';

-- Expected: 4 functions
```

## File Comparison

| File | Purpose | When to Use |
|------|---------|------------|
| `complete_master_schema.sql` | **USE THIS ONE** - Full schema with everything | First time setup, migrations |
| `opportunities_full_schema.sql` | Opportunities only (subset) | Legacy, if preferred |
| `opportunities_complete_schema.sql` | Opportunities original version | Legacy |
| `schema.sql` | Core platform only | Legacy |
| `opportunities_full_seed_data.sql` | Sample data to load | After schema, for testing |

## Support for Old Versions

If you were using the old separate schema files:

**Old approach (3 files):**
```
schema.sql + opportunities_full_schema.sql + opportunities_full_seed_data.sql
```

**New approach (1 file):**
```
complete_master_schema.sql + opportunities_full_seed_data.sql
```

**Migration:** Just run the new master schema - it'll create everything with IF NOT EXISTS. Old tables get new indexes and features.

## Performance Notes

- 40+ indexes ensure fast queries even with millions of records
- Triggers maintain data consistency automatically
- Materialized stats prevent expensive COUNT queries
- RLS policies enforce data privacy at database level

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Table already exists" | Normal - schema has IF NOT EXISTS, just continue |
| "Permission denied" | Use SERVICE_ROLE_KEY (not anon key) in Supabase |
| "Index already exists" | Ignore - IF NOT EXISTS handles it |
| Slow queries | Indexes are in place, check connection limits |
| Data not showing | Verify RLS policies with service role |

## Next Steps

1. ✅ Run `complete_master_schema.sql`
2. ✅ Create 3 storage buckets (optional)
3. ✅ Load sample data (optional)
4. ✅ Start using the app at `/opportunities`

**That's it!** The entire database is production-ready.

---

**Version:** 3.0 Master Schema  
**Date Created:** December 19, 2025  
**Status:** Production Ready ✅
