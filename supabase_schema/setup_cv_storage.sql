-- =====================================================
-- SUPABASE STORAGE SETUP FOR CV UPLOADS
-- =====================================================
-- Run this script in: Supabase Dashboard → SQL Editor
-- Project: https://supabase.com/dashboard/project/mwtzmkqgflwovdopmwgo
-- =====================================================

-- Step 1: Create the 'cvs' storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cvs',
  'cvs',
  true,  -- Public bucket so companies can download CVs
  5242880,  -- 5MB file size limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
ON CONFLICT (id) DO NOTHING;

-- Step 2: Create policy for authenticated users to upload CVs
DROP POLICY IF EXISTS "Authenticated users can upload CVs" ON storage.objects;
CREATE POLICY "Authenticated users can upload CVs"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cvs');

-- Step 3: Create policy for public read access (companies can download)
DROP POLICY IF EXISTS "Public can read CVs" ON storage.objects;
CREATE POLICY "Public can read CVs"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'cvs');

-- Step 4: Create policy for users to delete their own uploads
DROP POLICY IF EXISTS "Users can delete their own CVs" ON storage.objects;
CREATE POLICY "Users can delete their own CVs"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Step 5: Create policy for users to update their own uploads  
DROP POLICY IF EXISTS "Users can update their own CVs" ON storage.objects;
CREATE POLICY "Users can update their own CVs"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'cvs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if bucket was created successfully
SELECT * FROM storage.buckets WHERE id = 'cvs';

-- Check storage policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%CV%';

-- =====================================================
-- SUCCESS!
-- =====================================================
-- The 'cvs' bucket is now ready for CV uploads
-- Students can now upload their CVs when applying to jobs
-- =====================================================
