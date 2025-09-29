/**
 * Utility to generate Zoho refresh token from authorization code
 * This is a one-time operation to get the refresh token
 */

export async function generateRefreshToken(authCode: string): Promise<{ success: boolean; refreshToken?: string; error?: string }> {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CLIENT_SECRET;
  
  if (!clientId || !clientSecret) {
    return {
      success: false,
      error: 'Missing ZOHO_CLIENT_ID or ZOHO_CLIENT_SECRET'
    };
  }
  
  if (!authCode) {
    return {
      success: false,
      error: 'Authorization code is required'
    };
  }
  
  console.log('[Token Generator] Exchanging authorization code for refresh token...');
  
  try {
    const tokenUrl = 'https://accounts.zoho.com/oauth/v2/token';
    
    // Determine redirect URI based on environment
    const redirectUri = process.env.NODE_ENV === 'production' 
      ? 'https://amyloid.ca/api/oauth/zoho/callback'
      : 'http://localhost:5000/api/oauth/zoho/callback';
    
    const params = new URLSearchParams({
      code: authCode,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });
    
    console.log('[Token Generator] Request parameters:', {
      hasCode: !!authCode,
      codeLength: authCode.length,
      clientId: clientId.substring(0, 10) + '...',
      redirectUri
    });
    
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });
    
    const responseText = await response.text();
    console.log('[Token Generator] Response status:', response.status);
    
    if (!response.ok) {
      console.error('[Token Generator] Error response:', responseText);
      return {
        success: false,
        error: `Failed to generate token: ${responseText}`
      };
    }
    
    const data = JSON.parse(responseText);
    
    if (data.refresh_token) {
      console.log('[Token Generator] ✅ Refresh token generated successfully!');
      console.log('[Token Generator] Access token expires in:', data.expires_in, 'seconds');
      
      return {
        success: true,
        refreshToken: data.refresh_token
      };
    } else if (data.error) {
      console.error('[Token Generator] Zoho error:', data.error);
      return {
        success: false,
        error: `Zoho error: ${data.error}`
      };
    } else {
      console.error('[Token Generator] Unexpected response:', data);
      return {
        success: false,
        error: 'No refresh token in response'
      };
    }
  } catch (error) {
    console.error('[Token Generator] Exception:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}