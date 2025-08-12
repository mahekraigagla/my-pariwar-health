import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, FileText, Clock, Bell, Shield, Users2, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import AddTimelineDialog from '@/components/timeline/AddTimelineDialog';
import AddReminderDialog from '@/components/reminders/AddReminderDialog';
import EnhancedEmergencyCard from '@/components/emergency/EnhancedEmergencyCard';
import AddDoctorDialog from '@/components/doctors/AddDoctorDialog';
import DocumentsList from '@/components/documents/DocumentsList';
import TimelineList from '@/components/timeline/TimelineList';
import RemindersList from '@/components/reminders/RemindersList';
import DoctorsList from '@/components/doctors/DoctorsList';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  blood_group?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
}

const MemberProfile = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchMember();
  }, [memberId, user]);

  const fetchMember = async () => {
    if (!user || !memberId) return;

    try {
      const { data, error } = await supabase
        .from('family_members')
        .select('*')
        .eq('id', memberId)
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setMember(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load member profile",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Member not found</h2>
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12 mt-16 max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-6 hover:bg-muted/50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-glow rounded-3xl flex items-center justify-center shadow-glow">
              <Users2 className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">{member.name}</h1>
              <p className="text-xl text-muted-foreground">{member.relation}</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {member.age && (
              <div className="bg-gradient-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300">
                <p className="text-sm font-medium text-muted-foreground mb-2">Age</p>
                <p className="text-xl font-bold text-foreground">{member.age} years</p>
              </div>
            )}
            {member.gender && (
              <div className="bg-gradient-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300">
                <p className="text-sm font-medium text-muted-foreground mb-2">Gender</p>
                <p className="text-xl font-bold text-foreground">{member.gender}</p>
              </div>
            )}
            {member.blood_group && (
              <div className="bg-gradient-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300">
                <p className="text-sm font-medium text-muted-foreground mb-2">Blood Group</p>
                <p className="text-xl font-bold text-foreground">{member.blood_group}</p>
              </div>
            )}
            {member.phone && (
              <div className="bg-gradient-card rounded-2xl p-6 shadow-soft hover:shadow-card transition-all duration-300">
                <p className="text-sm font-medium text-muted-foreground mb-2">Phone</p>
                <p className="text-xl font-bold text-foreground">{member.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 h-14 bg-muted/50 rounded-2xl p-2">
            <TabsTrigger value="overview" className="rounded-xl font-semibold">Overview</TabsTrigger>
            <TabsTrigger value="reminders" className="rounded-xl font-semibold">Reminders</TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-xl font-semibold">Timeline</TabsTrigger>
            <TabsTrigger value="documents" className="rounded-xl font-semibold">Documents</TabsTrigger>
            <TabsTrigger value="emergency" className="rounded-xl font-semibold">Health Card</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
              <Card className="border-0 shadow-soft bg-gradient-card">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    Active Reminders
                  </CardTitle>
                  <CardDescription className="text-base">Current medications and appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <RemindersList memberId={member.id} refresh={refreshTrigger} showLimited={true} />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-soft bg-gradient-card">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    Recent Timeline
                  </CardTitle>
                  <CardDescription className="text-base">Latest medical history entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <TimelineList memberId={member.id} refresh={refreshTrigger} showLimited={true} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reminders">
            <Card className="border-0 shadow-soft bg-gradient-card">
              <CardHeader className="pb-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    Reminders & Medications
                  </CardTitle>
                  <AddReminderDialog memberId={member.id} onReminderAdded={handleRefresh} />
                </div>
              </CardHeader>
              <CardContent>
                <RemindersList memberId={member.id} refresh={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card className="border-0 shadow-soft bg-gradient-card">
              <CardHeader className="pb-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    Medical Timeline
                  </CardTitle>
                  <AddTimelineDialog memberId={member.id} onTimelineAdded={handleRefresh} />
                </div>
              </CardHeader>
              <CardContent>
                <TimelineList memberId={member.id} refresh={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card className="border-0 shadow-soft bg-gradient-card">
              <CardHeader className="pb-6">
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-3 text-xl font-bold">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    Documents
                  </CardTitle>
                  <UploadDocumentDialog memberId={member.id} onDocumentUploaded={handleRefresh} />
                </div>
              </CardHeader>
              <CardContent>
                <DocumentsList memberId={member.id} refresh={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <div className="space-y-8">
              <EnhancedEmergencyCard member={member} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberProfile;