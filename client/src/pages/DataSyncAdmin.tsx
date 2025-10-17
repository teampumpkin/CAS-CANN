import { useState, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Upload, FileSpreadsheet, Loader2, FileCheck } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CheckpointData {
  phase: string;
  status: string;
  timestamp: string;
  details?: any;
}

interface ImportResult {
  module: string;
  recordsProcessed: number;
  recordsCreated: number;
  recordsSkipped: number;
  recordsFailed: number;
  executionTime: number;
  errors: Array<{row: number; record: any; error: string}>;
  warnings: string[];
}

interface UploadHistory {
  fileName: string;
  module: string;
  timestamp: string;
  status: 'uploaded' | 'imported' | 'failed';
  recordsProcessed?: number;
}

export default function DataSyncAdmin() {
  const [selectedModule, setSelectedModule] = useState<'Accounts' | 'Contacts' | 'Resources'>('Contacts');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string>('');
  const [dryRun, setDryRun] = useState(true);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const [fileValidation, setFileValidation] = useState<{ valid: boolean; message: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch import history
  const { data: historyData } = useQuery<{ checkpoints: CheckpointData[] }>({
    queryKey: ['/api/data-sync/history'],
  });

  // Validate file format
  const validateFile = (file: File): { valid: boolean; message: string } => {
    const validExtensions = ['.csv', '.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return { valid: false, message: 'Invalid file format. Please upload CSV or Excel (.xlsx, .xls) files only.' };
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return { valid: false, message: 'File too large. Maximum file size is 10MB.' };
    }
    
    return { valid: true, message: 'File format validated successfully!' };
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/data-sync/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
      return response.json();
    },
    onSuccess: (data) => {
      setUploadedFilePath(data.filePath);
      
      // Add to upload history
      const newHistoryItem: UploadHistory = {
        fileName: selectedFile?.name || 'unknown',
        module: selectedModule,
        timestamp: new Date().toISOString(),
        status: 'uploaded',
      };
      setUploadHistory(prev => [newHistoryItem, ...prev]);
      
      // Show success toast
      toast({
        title: "Thank You!",
        description: `${selectedFile?.name} has been uploaded successfully and is ready for import.`,
        variant: "default",
      });
      
      // Clear file input
      setSelectedFile(null);
      setFileValidation(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async (params: { filePath: string; moduleName: string; dryRun: boolean }): Promise<ImportResult> => {
      const response = await apiRequest('POST', '/api/data-sync/import', params);
      return await response.json();
    },
    onSuccess: (data: ImportResult) => {
      setImportResult(data);
      
      // Update upload history with import status
      setUploadHistory(prev => prev.map((item, idx) => 
        idx === 0 ? { ...item, status: 'imported' as const, recordsProcessed: data.recordsProcessed } : item
      ));
      
      // Show success toast for live imports
      if (!dryRun && data.recordsFailed === 0) {
        toast({
          title: "Import Complete!",
          description: `Successfully imported ${data.recordsCreated} records to ${selectedModule}`,
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/data-sync/history'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
      
      // Mark as failed in history
      setUploadHistory(prev => prev.map((item, idx) => 
        idx === 0 ? { ...item, status: 'failed' as const } : item
      ));
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validation = validateFile(file);
      
      setFileValidation(validation);
      
      if (validation.valid) {
        setSelectedFile(file);
        setUploadedFilePath('');
        setImportResult(null);
      } else {
        setSelectedFile(null);
        toast({
          title: "Invalid File",
          description: validation.message,
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('moduleName', selectedModule);

    uploadMutation.mutate(formData);
  };

  const handleImport = async () => {
    if (!uploadedFilePath) return;

    importMutation.mutate({
      filePath: uploadedFilePath,
      moduleName: selectedModule,
      dryRun,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6" data-testid="data-sync-admin">
      <div>
        <h1 className="text-3xl font-bold">Data Sync Admin</h1>
        <p className="text-muted-foreground">Import data to Zoho CRM modules safely</p>
      </div>

      {/* Upload Section */}
      <Card data-testid="upload-section">
        <CardHeader>
          <CardTitle>Upload Data File</CardTitle>
          <CardDescription>Upload CSV or Excel file for import to Zoho CRM</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="module">Target Module</Label>
              <Select value={selectedModule} onValueChange={(val) => setSelectedModule(val as any)}>
                <SelectTrigger id="module" data-testid="select-module">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accounts">Accounts (Institutions)</SelectItem>
                  <SelectItem value="Contacts">Contacts (Members)</SelectItem>
                  <SelectItem value="Resources">Resources (Documents)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file">Data File</Label>
              <Input
                id="file"
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                data-testid="input-file"
              />
            </div>
          </div>

          {fileValidation && (
            <Alert variant={fileValidation.valid ? "default" : "destructive"} data-testid="file-validation">
              {fileValidation.valid ? (
                <FileCheck className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{fileValidation.message}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !fileValidation?.valid || uploadMutation.isPending}
            data-testid="button-upload"
          >
            {uploadMutation.isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="mr-2 h-4 w-4" /> Upload & Preview</>
            )}
          </Button>

          {uploadedFilePath && (
            <Alert data-testid="upload-success">
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Ready for Import</AlertTitle>
              <AlertDescription>File is uploaded and validated. You can now proceed with the import below.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      {uploadedFilePath && (
        <Card data-testid="import-section">
          <CardHeader>
            <CardTitle>Execute Import</CardTitle>
            <CardDescription>Import data to {selectedModule} module</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="dryRun"
                checked={dryRun}
                onChange={(e) => setDryRun(e.target.checked)}
                className="rounded"
                data-testid="checkbox-dryrun"
              />
              <Label htmlFor="dryRun">Dry Run (test without saving to Zoho)</Label>
            </div>

            <Button
              onClick={handleImport}
              disabled={importMutation.isPending}
              variant={dryRun ? 'outline' : 'default'}
              data-testid="button-import"
            >
              {importMutation.isPending ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing...</>
              ) : (
                <><FileSpreadsheet className="mr-2 h-4 w-4" /> {dryRun ? 'Test Import (Dry Run)' : 'Execute Live Import'}</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Results Section */}
      {importResult && (
        <Card data-testid="results-section">
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Processed</p>
                <p className="text-2xl font-bold" data-testid="result-processed">{importResult.recordsProcessed}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-2xl font-bold text-green-600" data-testid="result-created">{importResult.recordsCreated}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Skipped</p>
                <p className="text-2xl font-bold text-yellow-600" data-testid="result-skipped">{importResult.recordsSkipped}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600" data-testid="result-failed">{importResult.recordsFailed}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Duration: {Math.round(importResult.executionTime / 1000)}s</p>
            </div>

            {importResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errors ({importResult.errors.length})</AlertTitle>
                <AlertDescription className="mt-2 space-y-1">
                  {importResult.errors.slice(0, 5).map((err, idx) => (
                    <div key={idx} className="text-sm">Row {err.row}: {err.error}</div>
                  ))}
                  {importResult.errors.length > 5 && (
                    <div className="text-sm">...and {importResult.errors.length - 5} more</div>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upload History Section */}
      <Card data-testid="history-section">
        <CardHeader>
          <CardTitle>Upload History</CardTitle>
          <CardDescription>Recently uploaded and imported files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {uploadHistory.slice(0, 10).map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{item.fileName}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.timestamp).toLocaleString()}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {item.module}
                    </Badge>
                    {item.recordsProcessed && (
                      <span className="text-xs text-muted-foreground">
                        {item.recordsProcessed} records
                      </span>
                    )}
                  </div>
                </div>
                <Badge 
                  variant={
                    item.status === 'imported' ? 'default' : 
                    item.status === 'uploaded' ? 'secondary' : 
                    'destructive'
                  }
                  data-testid={`status-${item.status}`}
                >
                  {item.status === 'imported' ? 'Imported' : 
                   item.status === 'uploaded' ? 'Uploaded' : 
                   'Failed'}
                </Badge>
              </div>
            ))}
            {uploadHistory.length === 0 && (
              <div className="text-center py-8">
                <FileSpreadsheet className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-muted-foreground">No upload history yet</p>
                <p className="text-sm text-muted-foreground">Upload a file to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
