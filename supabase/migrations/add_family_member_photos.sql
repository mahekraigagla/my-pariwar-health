-- Add photo support for family members
-- Migration: add_family_member_photos.sql

-- Add photo_url column to family_members table
ALTER TABLE public.family_members 
ADD COLUMN photo_url TEXT;

-- Create storage bucket for family member photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'family-photos', 
  'family-photos', 
  false, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for family photos
-- Allow users to upload photos to their own folder
CREATE POLICY IF NOT EXISTS "Users can upload family photos" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'family-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own family photos
CREATE POLICY IF NOT EXISTS "Users can view their own family photos" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'family-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own family photos
CREATE POLICY IF NOT EXISTS "Users can update their own family photos" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'family-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own family photos
CREATE POLICY IF NOT EXISTS "Users can delete their own family photos" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'family-photos' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Verify the bucket was created
SELECT * FROM storage.buckets WHERE name = 'family-photos';
