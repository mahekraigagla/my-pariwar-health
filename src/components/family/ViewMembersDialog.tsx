import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
}

const ViewMembersDialog = () => {
  const [open, setOpen] = useState(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchFamilyMembers = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFamilyMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load family members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && user) {
      fetchFamilyMembers();
    }
  }, [open, user]);

  const handleViewProfile = (memberId: string) => {
    setOpen(false);
    navigate(`/member/${memberId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="gap-2">
          <Users className="w-5 h-5" />
          View Members
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Family Members
          </DialogTitle>
          <DialogDescription>
            View all your family members and access their health profiles
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading family members...</p>
            </div>
          ) : familyMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Family Members Yet</h3>
              <p className="text-muted-foreground">
                Start by adding your family members to manage their health information.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {familyMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      <p className="text-muted-foreground capitalize">{member.relation}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-4">
                    {member.age && (
                      <p>Age: {member.age} years</p>
                    )}
                    {member.gender && (
                      <p>Gender: {member.gender}</p>
                    )}
                    {member.phone && (
                      <p>Phone: {member.phone}</p>
                    )}
                    {member.email && (
                      <p>Email: {member.email}</p>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => handleViewProfile(member.id)}
                    className="w-full gap-2"
                    variant="outline"
                  >
                    <Eye className="w-4 h-4" />
                    View Profile
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewMembersDialog;