# 🔧 OAuth Callback Troubleshooting Guide

## ❌ Issue: `/oauth/zoho/callback` Returns 400 Error

This is **EXPECTED BEHAVIOR** - you should not visit the callback URL directly!

---

## ✅ How OAuth Flow Works

```
Step 1: User visits /oauth/zoho/connect
         ↓
Step 2: Redirects to Zoho's authorization page
         ↓
Step 3: User clicks "Accept"
         ↓
Step 4: Zoho redirects back to /oauth/zoho/callback?code=...
         ↓
Step 5: Your app exchanges code for access token
         ↓
Step 6: Success page displayed
```

**Important:** The callback URL should **only** be called by Zoho after authorization, never directly by you!

---

## 🚀 Correct Way to Authenticate

### **Step 1: Visit the CONNECT endpoint (not callback)**

```
https://amyloid.ca/oauth/zoho/connect
```

This will:
1. Build the authorization URL with all required scopes
2. Redirect you to Zoho's authorization page
3. Show a page where you click "Accept"

### **Step 2: Authorize on Zoho's Page**

When redirected to Zoho:
1. Review the permissions being requested
2. Click **"Accept"** or **"Authorize"**
3. Zoho will automatically redirect back to your callback URL

### **Step 3: Automatic Callback**

Zoho will redirect to:
```
https://amyloid.ca/oauth/zoho/callback?code=AUTHORIZATION_CODE
```

Your app will:
1. ✅ Receive the authorization code
2. ✅ Exchange it for access token
3. ✅ Store tokens in database
4. ✅ **Automatically create email workflows**
5. ✅ Show success page

---

## 🔍 Why Direct Callback Access Fails

When you visit `/oauth/zoho/callback` directly, you get a 400 error because:

```javascript
// The callback expects a 'code' parameter from Zoho
if (!code) {
  return res.status(400).send("Authorization code not provided");
}
```

**This is correct behavior** - the callback URL should only receive requests from Zoho's servers after authorization.

---

## ✅ Verify Zoho Configuration

Make sure your Zoho OAuth client has the correct redirect URI configured:

### **In Zoho Developer Console**

1. Go to: https://api-console.zoho.com/
2. Select your client
3. Check **Redirect URI** matches exactly:
   ```
   https://amyloid.ca/oauth/zoho/callback
   ```

**Common mistakes:**
- ❌ `https://www.amyloid.ca/oauth/zoho/callback` (has www)
- ❌ `http://amyloid.ca/oauth/zoho/callback` (http instead of https)
- ❌ `https://amyloid.ca/oauth/callback` (missing /zoho/)
- ✅ `https://amyloid.ca/oauth/zoho/callback` (correct!)

---

## 🧪 Test the Complete Flow

### **Test 1: Start OAuth Flow**

Visit in your browser:
```
https://amyloid.ca/oauth/zoho/connect
```

**Expected:** Should redirect to Zoho's authorization page at `accounts.zoho.com`

### **Test 2: Check Authorization URL**

The connect endpoint should generate a URL like:
```
https://accounts.zoho.com/oauth/v2/auth?
  scope=ZohoCRM.modules.ALL,ZohoCRM.settings.fields.ALL,...
  &client_id=YOUR_CLIENT_ID
  &response_type=code
  &access_type=offline
  &redirect_uri=https://amyloid.ca/oauth/zoho/callback
```

### **Test 3: Authorize**

On Zoho's page:
1. Review permissions
2. Click "Accept"
3. Wait for redirect back to your app

**Expected:** Should redirect to `https://amyloid.ca/oauth/zoho/callback?code=...` and show success page

---

## 🐛 Debugging OAuth Issues

### **Issue 1: "Invalid Redirect URI" Error from Zoho**

**Cause:** Redirect URI in Zoho console doesn't match your app's URI

**Fix:**
1. Go to Zoho Developer Console
2. Update Redirect URI to: `https://amyloid.ca/oauth/zoho/callback`
3. Save changes
4. Try again

### **Issue 2: "Invalid OAuth Scope" Error**

**Cause:** One of the requested scopes doesn't exist

**Status:** ✅ **FIXED** - We removed the invalid `ZohoCRM.settings.automation.ALL` scope

**Current scopes** (all valid):
- `ZohoCRM.modules.ALL`
- `ZohoCRM.settings.fields.ALL`
- `ZohoCRM.settings.layouts.READ`
- `ZohoCRM.settings.profiles.READ`
- `ZohoCRM.send_mail.all.CREATE`
- `ZohoCRM.settings.workflow_rules.ALL`
- `ZohoCRM.settings.email_templates.READ`

### **Issue 3: Callback Shows "Authorization code not provided"**

**Cause:** You visited the callback URL directly instead of going through the OAuth flow

**Fix:** Start from `/oauth/zoho/connect` instead

### **Issue 4: "Token exchange failed"**

**Causes:**
- Client ID or Client Secret is incorrect
- Authorization code expired (codes expire in ~60 seconds)
- Redirect URI mismatch

**Fix:**
1. Verify `ZOHO_CLIENT_ID` and `ZOHO_CLIENT_SECRET` environment variables
2. Complete the OAuth flow quickly (within 60 seconds)
3. Ensure redirect URIs match exactly

---

## 📋 Quick Checklist

Before attempting OAuth:

- [ ] Environment variables set:
  - `ZOHO_CLIENT_ID` exists
  - `ZOHO_CLIENT_SECRET` exists
- [ ] Zoho Developer Console configured:
  - Redirect URI: `https://amyloid.ca/oauth/zoho/callback`
  - Client is "Active" status
- [ ] Start from correct URL:
  - ✅ Use: `https://amyloid.ca/oauth/zoho/connect`
  - ❌ Don't use: `https://amyloid.ca/oauth/zoho/callback`

---

## 🎯 Step-by-Step OAuth Guide

### **Method 1: Browser Flow (Recommended)**

1. Open browser
2. Visit: `https://amyloid.ca/oauth/zoho/connect`
3. Click "Accept" on Zoho's page
4. Wait for success message
5. Done! Workflows created automatically

### **Method 2: cURL Flow (Advanced)**

```bash
# Step 1: Get authorization URL
curl https://amyloid.ca/oauth/zoho/connect

# Step 2: Copy the Zoho URL from redirect
# Visit it in browser and authorize

# Step 3: After redirect, workflows are created automatically
```

---

## ✅ Expected Success Response

After successful authorization, you should see:

```html
✅ Zoho Authorization Successful!

Your Zoho CRM integration is now automatically configured!

✅ Automatic Token Management Active
  • Access tokens will automatically refresh before expiring
  • Your CANN membership forms will sync continuously with Zoho CRM
  • No manual token management required
  • Email notifications will be sent automatically for new registrations

Token expires in: 3600 seconds (1 hours)
```

---

## 🆘 Still Having Issues?

If OAuth still doesn't work:

1. **Check server logs:**
   ```bash
   grep -i "oauth" /tmp/logs/Start_application_*.log | tail -50
   ```

2. **Verify Zoho configuration:**
   - Client ID matches environment variable
   - Client Secret matches environment variable
   - Redirect URI is exact: `https://amyloid.ca/oauth/zoho/callback`
   - Client status is "Active"

3. **Test environment variables:**
   ```bash
   echo "ZOHO_CLIENT_ID: ${ZOHO_CLIENT_ID:0:10}..."
   echo "ZOHO_CLIENT_SECRET: ${ZOHO_CLIENT_SECRET:0:10}..."
   ```

4. **Check for Zoho errors:**
   - Look for `error` parameter in callback URL
   - Check Zoho Developer Console for API usage limits
   - Verify your Zoho account is active

---

## 📚 Resources

- **Zoho OAuth Documentation:** https://www.zoho.com/accounts/protocol/oauth.html
- **Zoho Developer Console:** https://api-console.zoho.com/
- **CRM API Scopes:** https://www.zoho.com/crm/developer/docs/api/v8/scopes.html

---

## ✅ Summary

**DO:**
- ✅ Start at `/oauth/zoho/connect`
- ✅ Click "Accept" on Zoho's page
- ✅ Wait for automatic redirect to callback

**DON'T:**
- ❌ Visit `/oauth/zoho/callback` directly
- ❌ Manually construct callback URLs
- ❌ Share authorization codes (they expire quickly)

**Your OAuth flow is correctly implemented - just start from the right URL!** 🚀
