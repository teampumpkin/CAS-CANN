# Complete Zoho CRM Integration Guide with Web-based OAuth

## 1. Zoho Setup (Web-based Client)

### 1.1 Create a Web-based Client in Zoho API Console

1. Go to https://api-console.zoho.com/
2. Click "ADD CLIENT" → Choose "Server-based Applications"
3. Fill in the details:
   - **Client Name**: CAS Website Integration
   - **Homepage URL**: https://amyloid.ca
   - **Authorized Redirect URIs**: 
     - Production: `https://amyloid.ca/api/oauth/zoho/callback`
     - Development: `http://localhost:5000/api/oauth/zoho/callback`
4. Click "CREATE" to generate Client ID and Client Secret

### 1.2 Required OAuth Scopes

```
ZohoCRM.modules.leads.ALL
ZohoCRM.settings.fields.ALL
```

### 1.3 Code Expiry Duration

**Important**: Authorization codes expire in **1 minute** by default. This is a security feature:
- The authorization code is single-use only
- Must be exchanged for tokens immediately
- If expired, user must reauthorize

## 2. OAuth Flow Implementation

### 2.1 Authorization URL Construction

```javascript
const authUrl = new URL('https://accounts.zoho.com/oauth/v2/auth');
authUrl.searchParams.append('scope', 'ZohoCRM.modules.leads.ALL,ZohoCRM.settings.fields.ALL');
authUrl.searchParams.append('client_id', CLIENT_ID);
authUrl.searchParams.append('response_type', 'code');
authUrl.searchParams.append('access_type', 'offline'); // Required for refresh_token
authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
authUrl.searchParams.append('prompt', 'consent'); // Forces consent screen
```

### 2.2 Token Exchange Flow

```
1. User clicks "Authorize with Zoho"
2. Redirected to Zoho login/consent page
3. After approval, redirected back with code parameter
4. Exchange code for access_token and refresh_token (within 1 minute!)
5. Store refresh_token securely
6. Use refresh_token to get new access_tokens as needed
```

## 3. Zoho Multi-Datacenter URLs

Zoho operates in multiple datacenters. URLs vary by region:

| Region | Authorization URL | API URL |
|--------|------------------|---------|
| US | https://accounts.zoho.com | https://www.zohoapis.com |
| EU | https://accounts.zoho.eu | https://www.zohoapis.eu |
| India | https://accounts.zoho.in | https://www.zohoapis.in |
| Australia | https://accounts.zoho.com.au | https://www.zohoapis.com.au |
| China | https://accounts.zoho.com.cn | https://www.zohoapis.com.cn |
| Japan | https://accounts.zoho.jp | https://www.zohoapis.jp |
| Canada | https://accounts.zohocloud.ca | https://www.zohoapis.ca |

## 4. Backend Implementation (Node.js/Express)

### 4.1 Environment Variables

```env
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_REDIRECT_URI=https://amyloid.ca/api/oauth/zoho/callback
ZOHO_API_DOMAIN=https://www.zohoapis.com
```

### 4.2 Token Management Service

```javascript
// server/zoho-token-manager.js
class ZohoTokenManager {
  constructor() {
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getValidAccessToken() {
    // Check if current token is valid (with 5-minute buffer)
    if (this.accessToken && this.tokenExpiry && 
        new Date() < new Date(this.tokenExpiry - 5 * 60 * 1000)) {
      return this.accessToken;
    }

    // Refresh the token
    return await this.refreshAccessToken();
  }

  async refreshAccessToken() {
    const response = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        refresh_token: process.env.ZOHO_REFRESH_TOKEN,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        grant_type: 'refresh_token'
      })
    });

    const data = await response.json();
    
    if (data.access_token) {
      this.accessToken = data.access_token;
      this.tokenExpiry = new Date(Date.now() + data.expires_in * 1000);
      return this.accessToken;
    }
    
    throw new Error('Failed to refresh access token');
  }
}
```

### 4.3 Zoho CRM Service

```javascript
// server/zoho-crm-service.js
class ZohoCRMService {
  constructor(tokenManager) {
    this.tokenManager = tokenManager;
    this.apiDomain = process.env.ZOHO_API_DOMAIN || 'https://www.zohoapis.com';
  }

  async createLead(formData) {
    const accessToken = await this.tokenManager.getValidAccessToken();
    
    // Map form fields to Zoho fields
    const leadData = {
      data: [{
        Last_Name: formData.fullName || 'Unknown', // Required field
        Email: formData.emailAddress,
        Company: formData.institutionName || 'Not Provided',
        Lead_Source: 'Website',
        Description: this.formatDescription(formData),
        
        // Custom fields (create these in Zoho CRM if needed)
        Professional_Designation: formData.discipline,
        Subspecialty: formData.subspecialty,
        Amyloidosis_Type: formData.amyloidosisType,
        Areas_of_Interest: formData.areasOfInterest,
        Communication_Consent: formData.communicationConsent,
        Presenting_Interest: formData.presentingInterest,
        Presentation_Topic: formData.presentationTopic,
        Form_Source: 'Join CANN Today'
      }],
      trigger: ['approval', 'workflow', 'blueprint']
    };

    const response = await fetch(`${this.apiDomain}/crm/v3/Leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(leadData)
    });

    const result = await response.json();
    
    if (result.data && result.data[0] && result.data[0].details) {
      return {
        success: true,
        leadId: result.data[0].details.id,
        createdTime: result.data[0].details.Created_Time
      };
    }
    
    throw new Error(result.message || 'Failed to create lead');
  }

  formatDescription(formData) {
    return `
Form: Join CANN Today
Submitted: ${new Date().toISOString()}

Professional Information:
- Name: ${formData.fullName}
- Email: ${formData.emailAddress}
- Designation: ${formData.discipline}
- Subspecialty: ${formData.subspecialty}
- Institution: ${formData.institutionName}

Amyloidosis Details:
- Type: ${formData.amyloidosisType}
- Other Type: ${formData.otherAmyloidosisType || 'N/A'}

Interests:
- Areas: ${formData.areasOfInterest}
- Other Interests: ${formData.otherInterest || 'N/A'}
- Presenting Interest: ${formData.presentingInterest}
- Presentation Topic: ${formData.presentationTopic || 'N/A'}

Consent:
- Communication: ${formData.communicationConsent}
- Services Map: ${formData.servicesMapConsent}
- Follow-up: ${formData.followUpConsent}
    `.trim();
  }
}
```

### 4.4 Express Routes

```javascript
// server/routes.js
const tokenManager = new ZohoTokenManager();
const zohoService = new ZohoCRMService(tokenManager);

// OAuth Authorization Endpoint
app.get('/api/oauth/zoho/authorize', (req, res) => {
  const authUrl = new URL('https://accounts.zoho.com/oauth/v2/auth');
  authUrl.searchParams.append('scope', 'ZohoCRM.modules.leads.ALL,ZohoCRM.settings.fields.ALL');
  authUrl.searchParams.append('client_id', process.env.ZOHO_CLIENT_ID);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('access_type', 'offline');
  authUrl.searchParams.append('redirect_uri', process.env.ZOHO_REDIRECT_URI);
  authUrl.searchParams.append('prompt', 'consent');
  
  res.redirect(authUrl.toString());
});

// OAuth Callback Endpoint
app.get('/api/oauth/zoho/callback', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    return res.status(400).send(`Authorization failed: ${error}`);
  }
  
  if (!code) {
    return res.status(400).send('No authorization code received');
  }
  
  try {
    // Exchange code for tokens (must be done within 1 minute!)
    const tokenResponse = await fetch('https://accounts.zoho.com/oauth/v2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: process.env.ZOHO_REDIRECT_URI,
        grant_type: 'authorization_code'
      })
    });
    
    const tokens = await tokenResponse.json();
    
    if (tokens.refresh_token) {
      // Store refresh_token securely (in production, use encrypted database)
      console.log('IMPORTANT: Save this refresh token:');
      console.log(tokens.refresh_token);
      
      res.send(`
        <html>
          <body>
            <h2>Authorization Successful!</h2>
            <p>Refresh token has been generated. Check server logs.</p>
            <p>Add to environment: ZOHO_REFRESH_TOKEN=${tokens.refresh_token}</p>
            <script>window.close();</script>
          </body>
        </html>
      `);
    } else {
      throw new Error('No refresh token received');
    }
  } catch (error) {
    console.error('Token exchange failed:', error);
    res.status(500).send('Failed to exchange authorization code');
  }
});

// Form Submission Endpoint
app.post('/api/submit-form', async (req, res) => {
  try {
    const { form_name, data } = req.body;
    
    // Validate required fields
    if (form_name !== 'Join CANN Today') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid form' 
      });
    }
    
    // Create lead in Zoho CRM
    const result = await zohoService.createLead(data);
    
    res.json({
      success: true,
      message: 'Registration submitted successfully',
      leadId: result.leadId,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Form submission error:', error);
    
    // Detailed error logging for debugging
    if (error.response) {
      console.error('Zoho API Error:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to process registration',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});
```

## 5. React Frontend Implementation

### 5.1 Form Component

```javascript
// client/src/pages/AboutCANN.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function AboutCANN() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const formData = {
        form_name: 'Join CANN Today',
        data: {
          fullName: values.fullName,
          emailAddress: values.email,
          discipline: values.professionalDesignation,
          subspecialty: values.subspecialty,
          institutionName: values.institution,
          communicationConsent: values.communicationConsent === 'yes' ? 'Yes' : 'No',
          servicesMapConsent: 'Yes',
          amyloidosisType: values.amyloidosisType,
          otherAmyloidosisType: values.otherAmyloidosisType || '',
          areasOfInterest: values.areasOfInterest.join(', '),
          otherInterest: values.otherInterest || '',
          presentingInterest: values.presentingInterest,
          presentationTopic: values.presentationTopic || '',
          followUpConsent: values.communicationConsent === 'yes' ? 'Yes' : 'No'
        }
      };

      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for joining CANN! We\'ll be in touch soon.'
        });
        // Reset form or redirect
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      
      setSubmitStatus({
        type: 'error',
        message: error.message.includes('network') 
          ? 'Network error. Please check your connection and try again.'
          : 'Unable to submit your registration. Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="join-section">
      {/* Form fields */}
      <input 
        {...register('fullName', { required: 'Full name is required' })}
        placeholder="Full Name"
      />
      {errors.fullName && <span>{errors.fullName.message}</span>}
      
      {/* Add other form fields similarly */}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Join CANN Today'}
      </button>
      
      {submitStatus && (
        <div className={submitStatus.type === 'success' ? 'success' : 'error'}>
          {submitStatus.message}
        </div>
      )}
    </form>
  );
}
```

## 6. Testing Tips

### 6.1 Test OAuth Flow
```bash
# 1. Get authorization URL
curl http://localhost:5000/api/oauth/zoho/authorize

# 2. After authorization, test token refresh
curl -X POST http://localhost:5000/api/test-token-refresh

# 3. Test form submission
curl -X POST http://localhost:5000/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{"form_name":"Join CANN Today","data":{"fullName":"Test User","emailAddress":"test@example.com"}}'
```

### 6.2 Verify Lead Creation
1. Log into Zoho CRM
2. Navigate to Leads module
3. Check for new lead with matching email
4. Verify all fields mapped correctly

## 7. Production Best Practices

### 7.1 Security
- Store credentials in encrypted environment variables
- Never expose tokens in client-side code
- Use HTTPS for all OAuth endpoints
- Implement rate limiting on form submissions

### 7.2 Token Management
```javascript
// Implement token caching with Redis
const redis = require('redis');
const client = redis.createClient();

class TokenCache {
  async getToken() {
    const cached = await client.get('zoho_access_token');
    if (cached) {
      const { token, expiry } = JSON.parse(cached);
      if (new Date() < new Date(expiry)) {
        return token;
      }
    }
    return null;
  }
  
  async setToken(token, expiresIn) {
    const expiry = new Date(Date.now() + expiresIn * 1000);
    await client.setex('zoho_access_token', expiresIn - 300, 
      JSON.stringify({ token, expiry }));
  }
}
```

### 7.3 Error Handling
```javascript
// Comprehensive error handling
class ZohoErrorHandler {
  handle(error) {
    if (error.code === 'INVALID_TOKEN') {
      // Force token refresh
      return this.refreshAndRetry();
    } else if (error.code === 'DUPLICATE_DATA') {
      // Handle duplicate lead
      return this.updateExisting();
    } else if (error.code === 'MANDATORY_NOT_FOUND') {
      // Missing required field
      return this.addMissingFields();
    }
    // Log to monitoring service
    this.logError(error);
  }
}
```

### 7.4 Monitoring
- Log all OAuth operations
- Track token refresh frequency
- Monitor API rate limits
- Set up alerts for failed submissions

## 8. Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Code expired | Took >1 minute to exchange | Exchange immediately after redirect |
| Invalid token | Access token expired | Implement automatic refresh |
| Duplicate lead | Email already exists | Use upsert or search before create |
| Missing field | Required field not mapped | Ensure Last_Name always populated |
| Rate limit | Too many API calls | Implement queuing and batching |

## 9. API Rate Limits

Zoho CRM API limits:
- 5000 credits per day (per org)
- Creating a lead costs 1 credit
- Bulk operations more efficient
- Rate limit headers: `X-RATELIMIT-LIMIT`, `X-RATELIMIT-REMAINING`, `X-RATELIMIT-RESET`

## 10. Multi-Environment Setup

```javascript
// config/zoho.js
const config = {
  development: {
    authUrl: 'https://accounts.zoho.com',
    apiUrl: 'https://www.zohoapis.com',
    redirectUri: 'http://localhost:5000/api/oauth/zoho/callback'
  },
  production: {
    authUrl: process.env.ZOHO_AUTH_URL || 'https://accounts.zoho.com',
    apiUrl: process.env.ZOHO_API_URL || 'https://www.zohoapis.com',
    redirectUri: 'https://amyloid.ca/api/oauth/zoho/callback'
  }
};

module.exports = config[process.env.NODE_ENV || 'development'];
```