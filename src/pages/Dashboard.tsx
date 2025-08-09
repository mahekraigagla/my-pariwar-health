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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">
            Manage your family's health with Pariwar+ AI Health Buddy
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{familyMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Family Members</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                  <Pill className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Active Medications</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Pending Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Add Family Member */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Add Family Member</CardTitle>
              <CardDescription>
                Add new family members to manage their health information
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <AddMemberDialog onMemberAdded={handleMemberAdded} />
            </CardContent>
          </Card>

          {/* View Members */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-xl">View Members</CardTitle>
              <CardDescription>
                View and manage all your family members' profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                View all family members below in the table
              </p>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {familyMembers.length} Members
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Family Members Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">Family Members</CardTitle>
                <CardDescription>
                  Click on any member to view their detailed health profile
                </CardDescription>
              </div>
              <AddMemberDialog onMemberAdded={handleMemberAdded} />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-muted-foreground">Loading family members...</p>
              </div>
            ) : familyMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Family Members Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by adding your family members to manage their health information.
                </p>
                <AddMemberDialog onMemberAdded={handleMemberAdded} />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {familyMembers.map((member) => (
                  <FamilyMemberCard key={member.id} member={member} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;