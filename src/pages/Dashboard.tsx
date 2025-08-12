import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Heart, 
  Plus, 
  Calendar, 
  FileText, 
  Users, 
  Bell, 
  Settings,
  Pill,
  Activity,
  Shield,
  Download,
  Upload
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import AddMemberDialog from '@/components/family/AddMemberDialog';
import FamilyMemberCard from '@/components/family/FamilyMemberCard';
import ViewMembersDialog from '@/components/family/ViewMembersDialog';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFamilyMembers();
    }
  }, [user]);

  const fetchFamilyMembers = async () => {
    if (!user) return;

    try {
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

  const handleMemberAdded = () => {
    fetchFamilyMembers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 mt-16 max-w-7xl">
        {/* Welcome Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                Welcome back, {user?.email?.split('@')[0]}!
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your family's health with Pariwar+ AI Health Buddy
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-primary/5 via-white to-primary/5 shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground mb-1">{familyMembers.length}</p>
                  <p className="text-sm font-medium text-muted-foreground">Family Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-secondary/5 via-white to-secondary/5 shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary/80 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
                  <Pill className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground mb-1">0</p>
                  <p className="text-sm font-medium text-muted-foreground">Active Medications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-accent/5 via-white to-accent/5 shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/80 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground mb-1">0</p>
                  <p className="text-sm font-medium text-muted-foreground">Upcoming Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-destructive/5 via-white to-destructive/5 shadow-soft">
            <CardContent className="p-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-destructive to-destructive/80 rounded-2xl flex items-center justify-center shadow-soft group-hover:shadow-glow transition-all duration-300">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-foreground mb-1">0</p>
                  <p className="text-sm font-medium text-muted-foreground">Pending Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Add Family Member */}
          <Card className="group hover:shadow-card transition-all duration-300 border-0 shadow-soft bg-gradient-card">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                <Plus className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold mb-3">Add Family Member</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Add new family members to manage their health information
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <AddMemberDialog onMemberAdded={handleMemberAdded} />
            </CardContent>
          </Card>

          {/* View Members */}
          <Card className="group hover:shadow-card transition-all duration-300 border-0 shadow-soft bg-gradient-card">
            <CardHeader className="text-center pb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-secondary/80 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-soft group-hover:shadow-glow transition-all duration-300 group-hover:scale-110">
                <Users className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold mb-3">View Members</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                View and manage all your family members' profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <ViewMembersDialog />
            </CardContent>
          </Card>
        </div>

        {/* Quick Summary */}
        <Card className="border-0 shadow-soft bg-gradient-card">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-bold">Family Overview</CardTitle>
            <CardDescription className="text-base">
              You have {familyMembers.length} family member{familyMembers.length !== 1 ? 's' : ''} registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground mb-6">
                Use the buttons above to add new members or view existing ones
              </p>
              {familyMembers.length > 0 && (
                <p className="text-muted-foreground">
                  Click "View Members" to see all family members and access their health profiles
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;