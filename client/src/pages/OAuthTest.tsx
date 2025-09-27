import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

type HealthCheckResponse = {
  status: string;
  oauth: {
    isValid: boolean;
    needsRefresh: boolean;
    activeTokens: number;
  };
  timestamp: string;
};

export default function OAuthTest() {
  const { data: healthCheck, isLoading, refetch } = useQuery<HealthCheckResponse>({
    queryKey: ['/api/health-check'],
    retry: false
  });

  const handleStartOAuth = () => {
    window.location.href = '/api/oauth/zoho/auth';
  };

  const handleRetrySubmissions = async () => {
    try {
      const response = await fetch('/api/retry-failed-submissions', {
        method: 'POST'
      });
      const result = await response.json();
      alert(`Retry result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Zoho CRM OAuth Integration Test
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Test and manage the Zoho CRM OAuth integration for form submissions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* OAuth Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                OAuth Status
                {isLoading ? (
                  <Badge variant="secondary">Loading...</Badge>
                ) : healthCheck?.oauth?.isValid ? (
                  <Badge variant="default" className="bg-green-600">Connected</Badge>
                ) : (
                  <Badge variant="destructive">Not Connected</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Current status of Zoho CRM OAuth authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {healthCheck && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Valid Token:</span>
                    <span className={healthCheck.oauth.isValid ? 'text-green-600' : 'text-red-600'}>
                      {healthCheck.oauth.isValid ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Needs Refresh:</span>
                    <span className={healthCheck.oauth.needsRefresh ? 'text-yellow-600' : 'text-green-600'}>
                      {healthCheck.oauth.needsRefresh ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Tokens:</span>
                    <span>{healthCheck.oauth.activeTokens}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Check:</span>
                    <span className="text-xs">{new Date(healthCheck.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  Refresh Status
                </Button>
                {!healthCheck?.oauth?.isValid && (
                  <Button onClick={handleStartOAuth} className="bg-[#00AFE6] hover:bg-[#0089BA]">
                    Start OAuth Flow
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Manage form submissions and OAuth integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Form Submissions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Retry failed submissions after OAuth is connected
                </p>
                <Button 
                  onClick={handleRetrySubmissions}
                  variant="outline"
                  disabled={!healthCheck?.oauth?.isValid}
                >
                  Retry Failed Submissions
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">OAuth Management</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage Zoho CRM authentication
                </p>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleStartOAuth}
                    className="bg-[#00AFE6] hover:bg-[#0089BA]"
                  >
                    Connect to Zoho
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Setup Instructions</CardTitle>
            <CardDescription>
              Complete these steps to enable automatic form sync to Zoho CRM
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Add <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">https://amyloid.ca/api/oauth/zoho/callback</code> to your Zoho Developer Console Authorized Redirect URIs</li>
              <li>Click "Connect to Zoho" above to start the OAuth flow</li>
              <li>Log in to your Zoho account and grant permissions</li>
              <li>Once connected, click "Retry Failed Submissions" to sync pending forms</li>
              <li>New form submissions will automatically sync to Zoho CRM</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}