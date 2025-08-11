import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Trash2, Edit } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface TimelineEntry {
  id: string;
  title: string;
  event_type: string;
  event_date: string;
  severity?: string;
  notes?: string;
  created_at: string;
}

interface TimelineListProps {
  memberId: string;
  refresh: number;
  showLimited?: boolean;
}

const TimelineList = ({ memberId, refresh, showLimited = false }: TimelineListProps) => {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTimeline();
  }, [memberId, refresh]);

  const fetchTimeline = async () => {
    try {
      let query = supabase
        .from('medical_timeline')
        .select('*')
        .eq('family_member_id', memberId)
        .order('event_date', { ascending: false });

      if (showLimited) {
        query = query.limit(3);
      }

      const { data, error } = await query;

      if (error) throw error;
      setTimeline(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load timeline",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from('medical_timeline')
        .delete()
        .eq('id', entryId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline entry deleted successfully",
      });
      
      fetchTimeline();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case 'illness': return 'bg-red-100 text-red-800';
      case 'medication': return 'bg-blue-100 text-blue-800';
      case 'surgery': return 'bg-orange-100 text-orange-800';
      case 'recovery': return 'bg-green-100 text-green-800';
      case 'checkup': return 'bg-purple-100 text-purple-800';
      case 'vaccination': return 'bg-teal-100 text-teal-800';
      case 'injury': return 'bg-yellow-100 text-yellow-800';
      case 'test': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (timeline.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Timeline Entries Yet</h3>
          <p className="text-muted-foreground">
            Add medical events to start tracking health history
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {timeline.map((entry, index) => (
          <div key={entry.id} className="relative flex items-start gap-4 pb-8">
            {/* Timeline line */}
            {index < timeline.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-full bg-border"></div>
            )}
            
            {/* Timeline dot */}
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-primary" />
            </div>

            {/* Content */}
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{entry.title}</h3>
                      <Badge className={getEventTypeColor(entry.event_type)}>
                        {entry.event_type}
                      </Badge>
                      {entry.severity && (
                        <Badge variant={getSeverityColor(entry.severity)}>
                          {entry.severity}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(entry.event_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {entry.notes && (
                      <p className="text-sm mb-2">{entry.notes}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Added: {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Timeline Entry</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{entry.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(entry.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineList;