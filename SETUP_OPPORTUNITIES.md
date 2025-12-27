# Opportunities Portal - Setup Instructions

## ⚠️ Current Issue

The Opportunities portal is not showing jobs because the Supabase schema hasn't been set up yet. This is a ONE-TIME setup process.

## Quick Fix (5 minutes)

### Step 1: Run Schema in Supabase

1. Open your Supabase Dashboard: https://app.supabase.com
2. Go to **SQL Editor** 
3. Click **New Query**
4. Copy the ENTIRE contents of this file:
   - `supabase_schema/opportunities_full_schema.sql`
5. Click **Run** and wait for completion

### Step 2: Create Storage Buckets

Go to **Storage** tab and create 3 buckets:

| Name | Public | Purpose |
|------|--------|---------|
| `cvs` | Yes | Student CVs |
| `company-logos` | Yes | Company logos |
| `company-docs` | No | Company registration docs |

### Step 3: (Optional) Add Sample Data

Run this in SQL Editor:
```sql
-- Copy contents of supabase_schema/opportunities_full_seed_data.sql
```

This adds 6 sample companies and 12 sample jobs.

## After Setup

Refresh the page at `/opportunities` - jobs should now display!

## Features That Will Work

✅ **For Students:**
- Browse 6+ jobs with filters
- Apply for jobs (with CV upload)
- Save/bookmark jobs
- Track application status

✅ **For Companies:**
- Register company (free 60-day trial)
- Post jobs (₹199 platform fee for paid jobs)
- Manage applications & applicants
- Download CVs from student applications

✅ **For Admins:**
- Verify companies
- Approve job postings
- View all opportunities metrics

## Database Tables Created

- `companies` - Company registrations
- `job_posts` - Job listings
- `job_applications` - Student applications
- `company_subscriptions` - Billing & trial tracking
- `saved_jobs` - Bookmarked jobs by students
- `cv_download_logs` - Compliance tracking
- Plus 3 more tables for complete feature set

## API Endpoints (28 total)

All endpoints are ready and working once schema is imported:

**Public Endpoints:**
- `GET /api/opportunities/jobs` - Browse jobs
- `GET /api/opportunities/companies` - View companies

**Authenticated Endpoints:**
- Student: `/candidate/dashboard` - View applications & saved jobs
- Company: `/company/dashboard` - Manage jobs & applicants
- Admin: `/admin` → Opportunities tab - Full management

## Troubleshooting

**Q: Still seeing no jobs after setup?**
- A: Refresh the page (hard refresh: Ctrl+Shift+R)

**Q: Getting "Table not found" error?**
- A: Run `opportunities_full_schema.sql` again in Supabase SQL Editor

**Q: Upload buttons not working?**
- A: Ensure storage buckets exist and are configured correctly

**Q: Students can't apply?**
- A: They must be logged in first, then click "Apply"

## Next Steps

1. Complete the 3 setup steps above
2. Go to `/opportunities` page
3. Jobs should load automatically
4. Try applying as a student or registering as a company

That's it! The entire feature is production-ready.
