import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Shield, Download, QrCode } from 'lucide-react';

interface FamilyMember {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  phone?: string;
}

interface EmergencyCardGeneratorProps {
  member: FamilyMember;
}

const EmergencyCardGenerator = ({ member }: EmergencyCardGeneratorProps) => {
  const { toast } = useToast();
  const [emergencyData, setEmergencyData] = useState({
    blood_group: member.blood_group || '',
    allergies: member.allergies || '',
    ongoing_medicines: '',
    medical_conditions: '',
    emergency_contact_name: member.emergency_contact_name || '',
    emergency_contact_phone: member.emergency_contact_phone || '',
    doctor_name: '',
    doctor_phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setEmergencyData(prev => ({ ...prev, [field]: value }));
  };

  const generateEmergencyCard = () => {
    // Create emergency profile URL with member ID
    const emergencyUrl = `${window.location.origin}/emergency/${member.id}`;
    
    // Create a simple PDF-like content for download
    const cardContent = `
EMERGENCY HEALTH CARD

Name: ${member.name}
Age: ${member.age || 'N/A'}
Gender: ${member.gender || 'N/A'}
Blood Group: ${emergencyData.blood_group || 'N/A'}

ALLERGIES:
${emergencyData.allergies || 'None specified'}

ONGOING MEDICINES:
${emergencyData.ongoing_medicines || 'None specified'}

MEDICAL CONDITIONS:
${emergencyData.medical_conditions || 'None specified'}

EMERGENCY CONTACT:
Name: ${emergencyData.emergency_contact_name || 'N/A'}
Phone: ${emergencyData.emergency_contact_phone || 'N/A'}

DOCTOR CONTACT:
Name: ${emergencyData.doctor_name || 'N/A'}
Phone: ${emergencyData.doctor_phone || 'N/A'}

QR CODE LINK: ${emergencyUrl}

Generated on: ${new Date().toLocaleDateString()}
    `;

    // Create and download the file
    const blob = new Blob([cardContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${member.name}_Emergency_Card.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Emergency Card Generated!",
      description: "Emergency health card has been downloaded. Print it and keep it in your wallet.",
    });
  };

  const generateQRCode = () => {
    const emergencyUrl = `${window.location.origin}/emergency/${member.id}`;
    
    // For now, we'll show the URL. In a real app, you'd integrate with a QR code library
    navigator.clipboard.writeText(emergencyUrl);
    
    toast({
      title: "QR Code URL Copied!",
      description: "Emergency profile URL copied to clipboard. Use any QR code generator to create a QR code.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Shield className="w-5 h-5" />
            Emergency Health Card Generator
          </CardTitle>
          <CardDescription>
            Generate a comprehensive emergency health card for {member.name} with QR code for quick access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="blood_group">Blood Group</Label>
              <Input
                id="blood_group"
                value={emergencyData.blood_group}
                onChange={(e) => handleInputChange('blood_group', e.target.value)}
                placeholder="e.g., A+, B-, O+"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                value={emergencyData.emergency_contact_name}
                onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                placeholder="Contact person name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                value={emergencyData.emergency_contact_phone}
                onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                placeholder="Contact phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doctor_name">Primary Doctor Name</Label>
              <Input
                id="doctor_name"
                value={emergencyData.doctor_name}
                onChange={(e) => handleInputChange('doctor_name', e.target.value)}
                placeholder="Primary doctor name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="doctor_phone">Doctor Phone</Label>
              <Input
                id="doctor_phone"
                value={emergencyData.doctor_phone}
                onChange={(e) => handleInputChange('doctor_phone', e.target.value)}
                placeholder="Doctor phone number"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              value={emergencyData.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              placeholder="List all known allergies (e.g., Penicillin, Shellfish, Nuts)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ongoing_medicines">Ongoing Medicines</Label>
            <Textarea
              id="ongoing_medicines"
              value={emergencyData.ongoing_medicines}
              onChange={(e) => handleInputChange('ongoing_medicines', e.target.value)}
              placeholder="List all current medications with dosages"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="medical_conditions">Medical Conditions</Label>
            <Textarea
              id="medical_conditions"
              value={emergencyData.medical_conditions}
              onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
              placeholder="List any chronic conditions, past surgeries, or important medical history"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button onClick={generateEmergencyCard} className="flex-1 gap-2" variant="destructive">
              <Download className="w-4 h-4" />
              Download Emergency Card
            </Button>
            <Button onClick={generateQRCode} variant="outline" className="flex-1 gap-2">
              <QrCode className="w-4 h-4" />
              Generate QR Code URL
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Emergency Card Preview</CardTitle>
          <CardDescription>
            This is how your emergency card will look
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-6 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-destructive">🆘 EMERGENCY HEALTH CARD</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Name:</strong> {member.name}</p>
                <p><strong>Age:</strong> {member.age || 'N/A'}</p>
                <p><strong>Gender:</strong> {member.gender || 'N/A'}</p>
                <p><strong>Blood Group:</strong> {emergencyData.blood_group || 'N/A'}</p>
              </div>
              
              <div>
                <p><strong>Emergency Contact:</strong> {emergencyData.emergency_contact_name || 'N/A'}</p>
                <p><strong>Contact Phone:</strong> {emergencyData.emergency_contact_phone || 'N/A'}</p>
                <p><strong>Doctor:</strong> {emergencyData.doctor_name || 'N/A'}</p>
                <p><strong>Doctor Phone:</strong> {emergencyData.doctor_phone || 'N/A'}</p>
              </div>
            </div>
            
            {emergencyData.allergies && (
              <div className="mt-4">
                <p className="font-semibold text-destructive">⚠️ ALLERGIES:</p>
                <p className="text-sm">{emergencyData.allergies}</p>
              </div>
            )}
            
            {emergencyData.ongoing_medicines && (
              <div className="mt-4">
                <p className="font-semibold">💊 CURRENT MEDICATIONS:</p>
                <p className="text-sm">{emergencyData.ongoing_medicines}</p>
              </div>
            )}
            
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                📱 Scan QR code for full medical profile
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyCardGenerator;