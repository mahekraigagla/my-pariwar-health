import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, Trash2, ExternalLink } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Document {
  id: string;
  title: string;
  document_type: string;
  document_date: string;
  file_url: string;
  file_name: string;
  notes?: string;
  created_at: string;
}

interface DocumentsListProps {
  memberId: string;
  refresh: number;
}

const DocumentsList = ({ memberId, refresh }: DocumentsListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDocuments();
  }, [memberId, refresh]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('family_member_id', memberId)
        .order('document_date', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    try {
      const { error } = await supabase
        .from('medical_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      
      fetchDocuments();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // Check if the file URL is accessible
      const response = await fetch(fileUrl);
      if (!response.ok) {
        throw new Error(`Failed to access file: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Download error:', error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download document. The file may not be accessible.",
        variant: "destructive",
      });
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

  if (documents.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Documents Yet</h3>
          <p className="text-muted-foreground">
            Upload medical documents to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((document) => (
        <Card key={document.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{document.title}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{document.document_type}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(document.document_date).toLocaleDateString()}
                    </span>
                  </div>
                  {document.notes && (
                    <p className="text-sm text-muted-foreground mb-2">{document.notes}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Uploaded: {new Date(document.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(document.file_url, document.file_name)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      // Check if the file URL is accessible
                      const response = await fetch(document.file_url);
                      if (!response.ok) {
                        throw new Error(`Failed to access file: ${response.status} ${response.statusText}`);
                      }
                      window.open(document.file_url, '_blank');
                    } catch (error: any) {
                      console.error('View error:', error);
                      toast({
                        title: "View Failed",
                        description: error.message || "Failed to view document. The file may not be accessible.",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Document</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{document.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(document.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentsList;