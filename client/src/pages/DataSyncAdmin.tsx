import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { apiRequest, queryClient } from '@/lib/queryClient';

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

export default function DataSyncAdmin() {
  const [selectedModule, setSelectedModule] = useState<'Accounts' | 'Contacts' | 'Resources'>('Contacts');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string>('');
  const [dryRun, setDryRun] = useState(true);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  // Fetch import history
  const { data: historyData } = useQuery<{ checkpoints: CheckpointData[] }>({
    queryKey: ['/api/data-sync/history'],
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/data-sync/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      return response.json();
    },
    onSuccess: (data) => {
      setUploadedFilePath(data.filePath);
    },
  });

  // Import mutation
  const importMutation = useMutation({
    mutationFn: async (params: { filePath: string; moduleName: string; dryRun: boolean }) => {
      return await apiRequest<ImportResult>('/api/data-sync/import', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: (data) => {
      setImportResult(data);
      queryClient.invalidateQueries({ queryKey: ['/api/data-sync/history'] });
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploadedFilePath('');
      setImportResult(null);
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
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                data-testid="input-file"
              />
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
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
              <AlertTitle>File Uploaded</AlertTitle>
              <AlertDescription>Ready to import: {selectedFile?.name}</AlertDescription>
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

      {/* History Section */}
      <Card data-testid="history-section">
        <CardHeader>
          <CardTitle>Import History</CardTitle>
          <CardDescription>Recent data sync checkpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {historyData?.checkpoints.slice(0, 10).map((checkpoint, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{checkpoint.phase}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(checkpoint.timestamp).toLocaleString()}
                  </p>
                </div>
                <Badge variant={checkpoint.status === 'success' ? 'default' : 'destructive'}>
                  {checkpoint.status}
                </Badge>
              </div>
            ))}
            {(!historyData?.checkpoints || historyData.checkpoints.length === 0) && (
              <p className="text-muted-foreground">No import history</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
