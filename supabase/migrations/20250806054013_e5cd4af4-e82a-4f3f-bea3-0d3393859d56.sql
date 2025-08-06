-- Create family_members table
CREATE TABLE public.family_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  relation TEXT NOT NULL,
  blood_group TEXT,
  allergies TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  is_account_head BOOLEAN DEFAULT false
);

-- Create medical_documents table
CREATE TABLE public.medical_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID NOT NULL REFERENCES public.family_members ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('Prescription', 'Lab', 'Bill', 'Other')),
  document_date DATE NOT NULL,
  file_url TEXT,
  file_name TEXT,
  notes TEXT
);

-- Create medical_timeline table
CREATE TABLE public.medical_timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID NOT NULL REFERENCES public.family_members ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('Illness', 'Surgery', 'Medication', 'Recovery', 'Vaccination', 'Other')),
  event_date DATE NOT NULL,
  notes TEXT,
  severity TEXT CHECK (severity IN ('Low', 'Medium', 'High'))
);

-- Create reminders table
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID NOT NULL REFERENCES public.family_members ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('Medicine', 'Appointment', 'Vaccination', 'Other')),
  dosage TEXT,
  frequency TEXT,
  reminder_time TIME,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true,
  notes TEXT
);

-- Create reminder_logs table for tracking compliance
CREATE TABLE public.reminder_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reminder_id UUID NOT NULL REFERENCES public.reminders ON DELETE CASCADE,
  family_member_id UUID NOT NULL REFERENCES public.family_members ON DELETE CASCADE,
  logged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('Taken', 'Missed', 'Skipped')),
  notes TEXT
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  family_member_id UUID NOT NULL REFERENCES public.family_members ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  doctor_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  hospital_name TEXT,
  address TEXT,
  visiting_hours TEXT,
  google_maps_link TEXT,
  notes TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;

-- Create policies for family_members
CREATE POLICY "Users can view their family members" 
ON public.family_members 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create family members" 
ON public.family_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their family members" 
ON public.family_members 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their family members" 
ON public.family_members 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create policies for medical_documents
CREATE POLICY "Users can view documents of their family members" 
ON public.medical_documents 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = medical_documents.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create documents for their family members" 
ON public.medical_documents 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = medical_documents.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update documents of their family members" 
ON public.medical_documents 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = medical_documents.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete documents of their family members" 
ON public.medical_documents 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = medical_documents.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

-- Create policies for medical_timeline
CREATE POLICY "Users can view timeline of their family members" 
ON public.medical_timeline 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = medical_timeline.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create timeline entries for their family members" 
ON public.medical_timeline 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = medical_timeline.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update timeline of their family members" 
ON public.medical_timeline 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = medical_timeline.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete timeline entries of their family members" 
ON public.medical_timeline 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = medical_timeline.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

-- Create policies for reminders
CREATE POLICY "Users can view reminders of their family members" 
ON public.reminders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = reminders.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create reminders for their family members" 
ON public.reminders 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = reminders.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update reminders of their family members" 
ON public.reminders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = reminders.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete reminders of their family members" 
ON public.reminders 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = reminders.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

-- Create policies for reminder_logs
CREATE POLICY "Users can view reminder logs of their family members" 
ON public.reminder_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = reminder_logs.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create reminder logs for their family members" 
ON public.reminder_logs 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = reminder_logs.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

-- Create policies for doctors
CREATE POLICY "Users can view doctors of their family members" 
ON public.doctors 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = doctors.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create doctors for their family members" 
ON public.doctors 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = doctors.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update doctors of their family members" 
ON public.doctors 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = doctors.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete doctors of their family members" 
ON public.doctors 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.family_members 
    WHERE family_members.id = doctors.family_member_id 
    AND family_members.user_id = auth.uid()
  )
);

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('medical-documents', 'medical-documents', false);

-- Create policies for medical documents storage
CREATE POLICY "Users can upload medical documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their medical documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their medical documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their medical documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'medical-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_family_members_updated_at
BEFORE UPDATE ON public.family_members
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_documents_updated_at
BEFORE UPDATE ON public.medical_documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_timeline_updated_at
BEFORE UPDATE ON public.medical_timeline
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at
BEFORE UPDATE ON public.reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at
BEFORE UPDATE ON public.doctors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to automatically create account head profile
CREATE OR REPLACE FUNCTION public.create_account_head_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.family_members (user_id, name, email, is_account_head, relation)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NEW.email, true, 'Self');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create account head profile when user signs up
CREATE TRIGGER on_auth_user_created_create_account_head
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_account_head_profile();