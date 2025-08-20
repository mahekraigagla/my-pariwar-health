import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload } from 'lucide-react';

interface UploadDocumentDialogProps {
  memberId: string;
  onDocumentUploaded: () => void;
}

const UploadDocumentDialog = ({ memberId, onDocumentUploaded }: UploadDocumentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    document_type: '',
    document_date: '',
    notes: '',
    file: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, file: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.file) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    if (!formData.document_type) {
      toast({
        title: "Error",
        description: "Please select a document type",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get the current user from Supabase auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Upload file to storage with user ID as folder structure
      const fileExt = formData.file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      // First, check if the bucket exists
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'medical-documents');
      
      if (!bucketExists) {
        throw new Error('Storage bucket "medical-documents" not found. Please contact support to enable document storage.');
      }
      
      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(fileName, formData.file);

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Failed to upload file: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('medical-documents')
        .getPublicUrl(fileName);

      // Save document record
      console.log('Inserting document with data:', {
        family_member_id: memberId,
        title: formData.title,
        document_type: formData.document_type,
        document_date: formData.document_date,
        notes: formData.notes,
        file_url: urlData.publicUrl,
        file_name: formData.file.name
      });

      const { error } = await supabase
        .from('medical_documents')
        .insert({
          family_member_id: memberId,
          title: formData.title,
          document_type: formData.document_type,
          document_date: formData.document_date,
          notes: formData.notes,
          file_url: urlData.publicUrl,
          file_name: formData.file.name
        });

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      toast({
        title: "Success!",
        description: "Document uploaded successfully!",
      });

      setFormData({
        title: '',
        document_type: '',
        document_date: '',
        notes: '',
        file: null
      });
      setOpen(false);
      onDocumentUploaded();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Medical Document</DialogTitle>
          <DialogDescription>
            Upload prescriptions, lab reports, bills, and other medical documents.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Blood Test Report"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document_type">Document Type *</Label>
            <Select value={formData.document_type} onValueChange={(value) => handleInputChange('document_type', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prescription">Prescription</SelectItem>
                <SelectItem value="Lab">Lab Report</SelectItem>
                <SelectItem value="Bill">Medical Bill</SelectItem>
                <SelectItem value="Other">Other (X-Ray, MRI, CT Scan, etc.)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="document_date">Document Date *</Label>
            <Input
              id="document_date"
              type="date"
              value={formData.document_date}
              onChange={(e) => handleInputChange('document_date', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">File Upload *</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              required
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: PDF, JPG, PNG (Max 10MB)
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this document..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;