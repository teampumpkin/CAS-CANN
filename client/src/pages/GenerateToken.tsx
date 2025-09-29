import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, CheckCircle, AlertCircle } from "lucide-react";

export default function GenerateToken() {
  const [authCode, setAuthCode] = useState("");
  const [refreshToken, setRefreshToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState(1);

  const clientId = "1000.PLL5OJGHHOMYR9VR6NFRXMGAVHDM1F";
  
  // Generate the authorization URL
  const getAuthUrl = () => {
    const baseUrl = "https://accounts.zoho.com/oauth/v2/auth";
    const params = new URLSearchParams({
      scope: "ZohoCRM.modules.leads.ALL,ZohoCRM.settings.fields.ALL",
      client_id: clientId,
      response_type: "code",
      access_type: "offline",
      redirect_uri: "https://amyloid.ca/api/oauth/zoho/callback"
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const handleGenerateToken = async () => {
    if (!authCode.trim()) {
      setError("Please enter the authorization code");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch('/api/generate-zoho-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authCode.trim() }),
      });

      const result = await response.json();

      if (result.success) {
        setRefreshToken(result.refreshToken);
        setStep(3);
      } else {
        setError(result.error || 'Failed to generate refresh token');
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(refreshToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openAuthUrl = () => {
    window.open(getAuthUrl(), '_blank');
    setStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Generate Zoho Refresh Token</h1>
        
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Get Authorization Code</CardTitle>
              <CardDescription>
                Click the button below to authorize your Zoho CRM application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This will open Zoho login page in a new window. After logging in and authorizing, 
                  you'll see a page with an authorization code or the code will be in the URL.
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={openAuthUrl} 
                className="w-full"
                data-testid="button-authorize"
              >
                Open Zoho Authorization Page
              </Button>
              
              <div className="text-sm text-gray-500">
                <p>Authorization URL (for manual copy if needed):</p>
                <code className="block bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2 break-all text-xs">
                  {getAuthUrl()}
                </code>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Enter Authorization Code</CardTitle>
              <CardDescription>
                After authorizing, copy the code from the URL or page and paste it here
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  The authorization code looks like: <code>1000.xxxxx.xxxxx</code>
                  <br />
                  It may appear in the URL after ?code= or on the page itself.
                </AlertDescription>
              </Alert>
              
              <Input
                type="text"
                placeholder="Enter authorization code (e.g., 1000.xxxxx.xxxxx)"
                value={authCode}
                onChange={(e) => setAuthCode(e.target.value)}
                className="font-mono"
                data-testid="input-auth-code"
              />
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Button 
                onClick={handleGenerateToken} 
                disabled={loading || !authCode.trim()}
                className="w-full"
                data-testid="button-generate"
              >
                {loading ? 'Generating...' : 'Generate Refresh Token'}
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 3 && refreshToken && (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Save Your Refresh Token</CardTitle>
              <CardDescription>
                Your refresh token has been generated successfully!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  Success! Copy this refresh token and save it as the ZOHO_REFRESH_TOKEN environment variable.
                </AlertDescription>
              </Alert>
              
              <div className="relative">
                <Input
                  type="text"
                  value={refreshToken}
                  readOnly
                  className="font-mono pr-10 bg-gray-50 dark:bg-gray-900"
                  data-testid="input-refresh-token"
                />
                <Button
                  onClick={copyToClipboard}
                  size="sm"
                  variant="ghost"
                  className="absolute right-1 top-1"
                  data-testid="button-copy"
                >
                  {copied ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              <Alert>
                <AlertDescription>
                  <strong>Important:</strong> Add this token to your environment variables as:
                  <code className="block mt-2 bg-gray-100 dark:bg-gray-800 p-2 rounded">
                    ZOHO_REFRESH_TOKEN={refreshToken}
                  </code>
                </AlertDescription>
              </Alert>
              
              <Button 
                onClick={() => {
                  setStep(1);
                  setAuthCode("");
                  setRefreshToken("");
                  setError("");
                }}
                variant="outline"
                className="w-full"
              >
                Generate Another Token
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}