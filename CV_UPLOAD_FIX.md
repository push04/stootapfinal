# 🎯 Quick Fix for CV Upload Failure

## Problem
Students cannot upload CVs when applying to job opportunities.

## Root Cause
The Supabase Storage bucket `cvs` doesn't exist.

---

## ⚡ Quick Fix (5 minutes)

### Option 1: Using Supabase UI (Recommended)

1. **Go to Supabase Dashboard**  
   https://supabase.com/dashboard/project/mwtzmkqgflwovdopmwgo

2. **Navigate to Storage**  
   Click **Storage** in the left sidebar

3. **Create New Bucket**  
   - Click **"New bucket"** or **"Create a new bucket"**
   - Bucket name: `cvs`
   - ✅ Public bucket: **ENABLE THIS**
   - File size limit: `5242880` (5MB)
   - Allowed MIME types: Leave empty or add:
     - `application/pdf`
     - `application/msword`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

4. **Click Create**

5. **Set Up Policies** (Click on bucket → Policies tab)
   - Enable "Allow public access for SELECT operations"
   - Enable "Allow authenticated users to INSERT"

### Option 2: Using SQL (Faster if you're comfortable with SQL)

1. Go to Supabase Dashboard → **SQL Editor**
2. Click **"New query"**
3. Copy and paste the contents of `supabase_schema/setup_cv_storage.sql`
4. Click **Run** or press `Ctrl+Enter`

---

## ✅ Verification

After creating the bucket, test immediately:

1. Navigate to any job opportunity on your site (e.g., http://localhost:5000/opportunities)
2. Click **"Apply Now"** on any job
3. Fill in the application form
4. Click **"Upload CV"** and select a PDF file (< 5MB)
5. You should see: **"CV uploaded successfully"** ✅

---

## 🔍 Troubleshooting

### "Upload failed" error
- Check that bucket name is exactly `cvs` (lowercase)
- Verify bucket is set to **public**
- Check file is under 5MB

### "Unauthorized" error
- Check storage policies are enabled
- Verify user is authenticated (logged in)

### Still not working?
- Check browser console (F12) for detailed error messages
- Verify Supabase environment variables are correct in `.env`

---

## 📊 What This Fixes

Once the bucket is created:

✅ Students can upload CVs when applying to jobs  
✅ CVs are stored securely in Supabase Storage  
✅ Companies can download applicant CVs  
✅ Public URLs are generated for CV access  
✅ File size and type validation works  

---

## 📝 Files Involved

- `supabase_schema/setup_cv_storage.sql` - SQL script to create bucket
- `client/src/pages/JobDetail.tsx` (line 194-228) - Upload code (no changes needed)

**No code changes required!** This is purely a configuration fix.
