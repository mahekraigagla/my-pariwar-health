import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';

interface AddDoctorDialogProps {
  memberId: string;
  onDoctorAdded: () => void;
}

const AddDoctorDialog = ({ memberId, onDoctorAdded }: AddDoctorDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    doctor_name: '',
    specialization: '',
    hospital_name: '',
    phone: '',
    email: '',
    address: '',
    visiting_hours: '',
    google_maps_link: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const { error } = await supabase
        .from('doctors')
        .insert({
          family_member_id: memberId,
          doctor_name: formData.doctor_name,
          specialization: formData.specialization,
          hospital_name: formData.hospital_name,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          visiting_hours: formData.visiting_hours,
          google_maps_link: formData.google_maps_link,
          notes: formData.notes
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Doctor added successfully!",
      });

      setFormData({
        doctor_name: '',
        specialization: '',
        hospital_name: '',
        phone: '',
        email: '',
        address: '',
        visiting_hours: '',
        google_maps_link: '',
        notes: ''
      });
      setOpen(false);
      onDoctorAdded();
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
          <Plus className="w-4 h-4" />
          Add Doctor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Doctor to Directory</DialogTitle>
          <DialogDescription>
            Add doctor contact information and hospital details for easy access.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="doctor_name">Doctor Name *</Label>
            <Input
              id="doctor_name"
              value={formData.doctor_name}
              onChange={(e) => handleInputChange('doctor_name', e.target.value)}
              placeholder="e.g., Dr. John Smith"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="specialization">Specialization *</Label>
            <Input
              id="specialization"
              value={formData.specialization}
              onChange={(e) => handleInputChange('specialization', e.target.value)}
              placeholder="e.g., Cardiologist, General Physician"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hospital_name">Hospital/Clinic Name</Label>
            <Input
              id="hospital_name"
              value={formData.hospital_name}
              onChange={(e) => handleInputChange('hospital_name', e.target.value)}
              placeholder="e.g., City General Hospital"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Contact phone number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="doctor@email.com"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Hospital/clinic address"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="visiting_hours">Visiting Hours</Label>
            <Input
              id="visiting_hours"
              value={formData.visiting_hours}
              onChange={(e) => handleInputChange('visiting_hours', e.target.value)}
              placeholder="e.g., Mon-Fri: 9:00 AM - 5:00 PM"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="google_maps_link">Google Maps Link</Label>
            <Input
              id="google_maps_link"
              type="url"
              value={formData.google_maps_link}
              onChange={(e) => handleInputChange('google_maps_link', e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this doctor or clinic..."
              rows={2}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Doctor'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDoctorDialog;