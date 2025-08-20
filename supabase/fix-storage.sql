-- Fix Storage Bucket Issue
-- Run this script in your Supabase SQL editor if you're getting "Bucket not found" errors

-- Enable storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage";

-- Create the medical-documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'medical-documents', 
  'medical-documents', 
  false, 
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for medical documents
-- Allow users to upload files to their own folder
CREATE POLICY IF NOT EXISTS "Users can upload medical documents" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'medical-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own medical documents
CREATE POLICY IF NOT EXISTS "Users can view their own medical documents" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'medical-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own medical documents
CREATE POLICY IF NOT EXISTS "Users can update their own medical documents" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'medical-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own medical documents
CREATE POLICY IF NOT EXISTS "Users can delete their own medical documents" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'medical-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Verify the bucket was created
SELECT * FROM storage.buckets WHERE name = 'medical-documents';
