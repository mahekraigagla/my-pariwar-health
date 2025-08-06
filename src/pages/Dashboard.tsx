import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const familyMembers = [
    { id: 1, name: 'John Doe', relation: 'Self', age: 35, lastCheckup: '2024-01-15' },
    { id: 2, name: 'Jane Doe', relation: 'Wife', age: 32, lastCheckup: '2024-01-10' },
    { id: 3, name: 'Mike Doe', relation: 'Son', age: 8, lastCheckup: '2024-01-05' },
  ];

  const medications = [
    { id: 1, name: 'Vitamin D3', dosage: '1000 IU', frequency: 'Daily', nextDose: '8:00 AM' },
    { id: 2, name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', nextDose: '6:00 PM' },
  ];

  const appointments = [
    { id: 1, doctor: 'Dr. Smith', type: 'Annual Checkup', date: '2024-02-15', time: '10:00 AM' },
    { id: 2, doctor: 'Dr. Johnson', type: 'Dental Cleaning', date: '2024-02-20', time: '2:00 PM' },
  ];

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
                  <p className="text-2xl font-bold">{medications.length}</p>
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
                  <p className="text-2xl font-bold">{appointments.length}</p>
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
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Pending Alerts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="family">Family</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="emergency">Emergency</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <p className="text-sm">Medication reminder: Vitamin D3 taken</p>
                    <Badge variant="secondary">2h ago</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    <p className="text-sm">Blood pressure reading added</p>
                    <Badge variant="secondary">1d ago</Badge>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <p className="text-sm">Appointment scheduled with Dr. Smith</p>
                    <Badge variant="secondary">3d ago</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Today's Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div>
                      <p className="font-medium">Take Vitamin D3</p>
                      <p className="text-sm text-muted-foreground">1000 IU</p>
                    </div>
                    <Badge>8:00 AM</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg">
                    <div>
                      <p className="font-medium">Blood Pressure Check</p>
                      <p className="text-sm text-muted-foreground">Weekly monitoring</p>
                    </div>
                    <Badge>Evening</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Family Tab */}
          <TabsContent value="family" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Family Members</h2>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Family Member
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {familyMembers.map((member) => (
                <Card key={member.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.relation}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Age:</span> {member.age}</p>
                      <p><span className="font-medium">Last Checkup:</span> {member.lastCheckup}</p>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Medications Tab */}
          <TabsContent value="medications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Medications</h2>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Medication
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {medications.map((med) => (
                <Card key={med.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                        <Pill className="w-6 h-6 text-secondary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{med.name}</h3>
                        <p className="text-sm text-muted-foreground">{med.dosage}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Frequency:</span> {med.frequency}</p>
                      <p><span className="font-medium">Next Dose:</span> {med.nextDose}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1">Edit</Button>
                      <Button variant="outline" className="flex-1">Mark Taken</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Appointments</h2>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Schedule Appointment
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appointments.map((apt) => (
                <Card key={apt.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-accent" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{apt.type}</h3>
                        <p className="text-sm text-muted-foreground">{apt.doctor}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Date:</span> {apt.date}</p>
                      <p><span className="font-medium">Time:</span> {apt.time}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="flex-1">Reschedule</Button>
                      <Button variant="outline" className="flex-1">Cancel</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Medical Reports</h2>
              <Button className="gap-2">
                <Upload className="w-4 h-4" />
                Upload Report
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Reports
                </CardTitle>
                <CardDescription>
                  Organize and access your family's medical reports
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Blood Test Results</p>
                      <p className="text-sm text-muted-foreground">January 15, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-secondary" />
                    <div>
                      <p className="font-medium">X-Ray Report</p>
                      <p className="text-sm text-muted-foreground">January 10, 2024</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Emergency Health Cards</h2>
              <Button variant="destructive" className="gap-2">
                <Shield className="w-4 h-4" />
                Generate Emergency Card
              </Button>
            </div>
            
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Shield className="w-5 h-5" />
                  Emergency Information
                </CardTitle>
                <CardDescription>
                  Quick access cards for emergency situations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-2">Emergency Contacts</h3>
                    <p className="text-sm text-muted-foreground">Dr. Smith: (555) 123-4567</p>
                    <p className="text-sm text-muted-foreground">Emergency: 911</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-2">Allergies</h3>
                    <p className="text-sm text-muted-foreground">Penicillin, Shellfish</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-2">Blood Type</h3>
                    <p className="text-sm text-muted-foreground">A+</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <h3 className="font-semibold mb-2">Current Medications</h3>
                    <p className="text-sm text-muted-foreground">Vitamin D3, Metformin</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code Card
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;