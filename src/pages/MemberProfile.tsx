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
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <Users2 className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{member.name}</h1>
              <p className="text-muted-foreground">{member.relation}</p>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {member.age && (
              <div className="bg-card rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-semibold">{member.age} years</p>
              </div>
            )}
            {member.gender && (
              <div className="bg-card rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-semibold">{member.gender}</p>
              </div>
            )}
            {member.blood_group && (
              <div className="bg-card rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-semibold">{member.blood_group}</p>
              </div>
            )}
            {member.phone && (
              <div className="bg-card rounded-lg p-3">
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-semibold">{member.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="emergency">Health Card</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Active Reminders
                  </CardTitle>
                  <CardDescription>Current medications and appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <RemindersList memberId={member.id} refresh={refreshTrigger} showLimited={true} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Timeline
                  </CardTitle>
                  <CardDescription>Latest medical history entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <TimelineList memberId={member.id} refresh={refreshTrigger} showLimited={true} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reminders">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
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
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
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
            <div className="space-y-6">
              <EnhancedEmergencyCard member={member} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MemberProfile;