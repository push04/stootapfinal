# Stootap - Quick Start Guide

## 🚀 Setup in 2 Minutes

### 1. Run Master Schema in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **SQL Editor** → **New Query**
4. Copy entire contents of: `supabase_schema/complete_master_schema.sql`
5. Click **Run** ✓

**That's it!** All 16 tables created with indexes, functions, triggers, and RLS policies.

### 2. Create Storage Buckets

Go to **Storage** tab → Create 3 buckets:

| Name | Public | Purpose |
|------|--------|---------|
| `cvs` | Yes | Student CVs (5MB max) |
| `company-logos` | Yes | Company logos (2MB max) |
| `company-docs` | No | Docs (10MB max) |

### 3. (Optional) Load Sample Data

Run in SQL Editor:
```bash
# Copy contents of: supabase_schema/opportunities_full_seed_data.sql
```

This adds 6 sample companies and 12 sample jobs.

## ✅ Features Now Working

### For Students
- Browse jobs at `/opportunities`
- Apply with CV upload
- Save/bookmark jobs
- Track applications at `/candidate/dashboard`

### For Companies
- Register at `/company/register` (60-day free trial)
- Post jobs (₹199 platform fee for paid listing)
- Manage applicants at `/company/dashboard`
- Download CVs from applications

### For Admins
- Verify companies
- Approve job postings
- View all metrics

## 🗄️ What's Created

**Master Schema File:** `supabase_schema/complete_master_schema.sql`

Creates all 16 tables:
- **Core Platform (8):** profiles, categories, services, orders, order_items, leads, cart_items, notifications
- **Opportunities (9):** companies, company_subscriptions, job_posts, job_post_payments, job_applications, saved_jobs, saved_companies, cv_download_logs, opportunity_notifications

Plus:
- 40+ indexes for performance
- 4 functions for automation
- 6 triggers for consistency
- RLS policies for security

## 💰 Pricing Model

| Feature | Price | Duration |
|---------|-------|----------|
| Company Trial | FREE | 60 days |
| Annual Subscription | ₹4,999 | 1 year |
| Paid Job Listing | ₹199 | 6 months |
| Unpaid Internship | FREE | Standard |

## 🔗 Key Routes

- `/opportunities` - Browse all jobs
- `/opportunities/:slug` - Job details
- `/company/register` - Register company
- `/company/dashboard` - Company panel
- `/candidate/dashboard` - Student dashboard
- `/admin` → Opportunities tab - Admin panel

## ⚡ API Endpoints (28 total)

All endpoints live at `/api/opportunities/`:
- `GET /jobs` - List jobs
- `POST /companies` - Register company
- `POST /jobs/:id/apply` - Apply for job
- `POST /jobs/:id/save` - Save job
- `GET /my-applications` - My applications
- And 23 more...

## 🐛 Troubleshooting

**Q: Still no jobs showing?**
- Refresh page (Ctrl+Shift+R)

**Q: Getting SQL errors?**
- Ensure you ran the complete master schema

**Q: Can't upload files?**
- Check storage buckets are created and public settings are correct

## 📞 Support

All features are production-ready. Database automatically handles everything with IF NOT EXISTS clauses - safe to run multiple times.

Enjoy! 🎉
