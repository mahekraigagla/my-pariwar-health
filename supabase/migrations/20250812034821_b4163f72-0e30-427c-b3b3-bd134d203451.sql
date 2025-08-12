-- Create storage policies for medical-documents bucket
-- Allow users to upload files to their own folder in medical-documents bucket
CREATE POLICY "Users can upload medical documents" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'medical-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own medical documents
CREATE POLICY "Users can view their own medical documents" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (
  bucket_id = 'medical-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own medical documents
CREATE POLICY "Users can update their own medical documents" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'medical-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own medical documents
CREATE POLICY "Users can delete their own medical documents" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'medical-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);