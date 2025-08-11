import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';

interface AddReminderDialogProps {
  memberId: string;
  onReminderAdded: () => void;
}

const AddReminderDialog = ({ memberId, onReminderAdded }: AddReminderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    reminder_type: '',
    start_date: '',
    end_date: '',
    reminder_time: '',
    frequency: '',
    dosage: '',
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
        .from('reminders')
        .insert({
          family_member_id: memberId,
          title: formData.title,
          reminder_type: formData.reminder_type,
          start_date: formData.start_date,
          end_date: formData.end_date || null,
          reminder_time: formData.reminder_time || null,
          frequency: formData.frequency,
          dosage: formData.dosage,
          notes: formData.notes
        });

      if (error) throw error;

      console.log('AddReminderDialog: Reminder added successfully');
      
      toast({
        title: "Success!",
        description: "Reminder added successfully!",
      });

      setFormData({
        title: '',
        reminder_type: '',
        start_date: '',
        end_date: '',
        reminder_time: '',
        frequency: '',
        dosage: '',
        notes: ''
      });
      setOpen(false);
      onReminderAdded();
    } catch (error: any) {
      console.error('AddReminderDialog: Error adding reminder:', error);
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
          Add Reminder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Smart Reminder</DialogTitle>
          <DialogDescription>
            Set reminders for medicines, appointments, and health checkups.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Take Vitamin D3"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reminder_type">Reminder Type *</Label>
            <Select value={formData.reminder_type} onValueChange={(value) => handleInputChange('reminder_type', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select reminder type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medicine">Medicine</SelectItem>
                <SelectItem value="Appointment">Appointment</SelectItem>
                <SelectItem value="Vaccination">Vaccination</SelectItem>
                <SelectItem value="Checkup">Health Checkup</SelectItem>
                <SelectItem value="Exercise">Exercise</SelectItem>
                <SelectItem value="Diet">Diet</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date *</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date (Optional)</Label>
            <Input
              id="end_date"
              type="date"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reminder_time">Reminder Time</Label>
            <Input
              id="reminder_time"
              type="time"
              value={formData.reminder_time}
              onChange={(e) => handleInputChange('reminder_time', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Twice Daily">Twice Daily</SelectItem>
                <SelectItem value="Three Times Daily">Three Times Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="As Needed">As Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.reminder_type === 'Medicine' && (
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage</Label>
              <Input
                id="dosage"
                value={formData.dosage}
                onChange={(e) => handleInputChange('dosage', e.target.value)}
                placeholder="e.g., 500mg, 1 tablet"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional instructions or notes..."
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
        <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
          {loading ? 'Adding...' : 'Add Reminder'}
        </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReminderDialog;