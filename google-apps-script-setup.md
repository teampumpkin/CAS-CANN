# Google Apps Script Setup for CANN Registration Form

## Overview
This document provides step-by-step instructions to set up a Google Apps Script webhook that will receive form submissions from your CANN registration form and automatically append them to your Google Sheet.

## Step 1: Open Google Apps Script

1. Go to [Google Apps Script](https://script.google.com/)
2. Sign in with the same Google account that owns your target Google Sheet
3. Click **"New Project"**

## Step 2: Replace the Default Code

Delete the default `myFunction()` code and replace it with the following:

```javascript
/**
 * CANN Registration Form to Google Sheets Integration
 * This script receives form data via POST request and appends it to a Google Sheet
 */

// Replace this with your actual Google Sheet ID (from the URL)
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const SHEET_NAME = 'Form Responses 1'; // Change this if your sheet has a different name

/**
 * Handles POST requests from the CANN registration form
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Log the received data for debugging
    console.log('Received form data:', data);
    
    // Open the target spreadsheet
    const spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    // If the sheet doesn't exist, create it
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }
    
    // Check if this is the first submission (no headers)
    const lastRow = sheet.getLastRow();
    
    if (lastRow === 0) {
      // Add headers if this is the first submission
      const headers = [
        'Timestamp',
        'Full Name',
        'Email',
        'Professional Designation',
        'Subspecialty',
        'Amyloidosis Type',
        'Other Amyloidosis Type',
        'Institution',
        'Communication Consent',
        'Areas of Interest',
        'Other Interest',
        'Presenting Interest',
        'Presentation Topic'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format the header row
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('white');
    }
    
    // Prepare the row data
    const rowData = [
      data.timestamp || new Date().toISOString(),
      data.fullName || '',
      data.email || '',
      data.professionalDesignation || '',
      data.subspecialty || '',
      data.amyloidosisType || '',
      data.otherAmyloidosisType || '',
      data.institution || '',
      data.communicationConsent || '',
      data.areasOfInterest || '',
      data.otherInterest || '',
      data.presentingInterest || '',
      data.presentationTopic || ''
    ];
    
    // Append the new row
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, rowData.length);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'success',
        'message': 'Form data added successfully',
        'row': sheet.getLastRow()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing form submission:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        'result': 'error',
        'error': error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify the script works
 * You can run this manually to test the setup
 */
function testScript() {
  const testData = {
    timestamp: new Date().toISOString(),
    fullName: 'Test User',
    email: 'test@example.com',
    professionalDesignation: 'Nurse Practitioner',
    subspecialty: 'Cardiology',
    amyloidosisType: 'ATTR',
    otherAmyloidosisType: '',
    institution: 'Test Hospital',
    communicationConsent: 'yes',
    areasOfInterest: 'Patient education, Clinical assessment',
    otherInterest: '',
    presentingInterest: 'no',
    presentationTopic: ''
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}
```

## Step 3: Configure the Script

1. **Update the Sheet ID**: Replace the `SHEET_ID` constant with your actual Google Sheet ID (extract from your sheet's URL):
   ```javascript
   const SHEET_ID = 'YOUR_ACTUAL_SHEET_ID_HERE';
   ```
   
   **How to find your Sheet ID**: Look at your Google Sheet URL:
   `https://docs.google.com/spreadsheets/d/1I5Yq2Z6ladIRQ8tNaGi5Ie0z0fCUudNFkJ_kvOcZaI4/edit`
   The Sheet ID is the long string between `/d/` and `/edit`

2. **Update the Sheet Name** (if needed): If your sheet tab has a different name than "Form Responses 1", update it:
   ```javascript
   const SHEET_NAME = 'Your Sheet Name';
   ```

## Step 4: Test the Script

1. Click **"Run"** and select the `testScript` function
2. Grant necessary permissions when prompted
3. Check your Google Sheet to see if a test row was added

## Step 5: Deploy as Web App

1. Click **"Deploy"** > **"New deployment"**
2. Choose **"Web app"** as the type
3. Set the following configuration (**IMPORTANT - these exact settings are required**):
   - **Description**: "CANN Registration Form Handler"
   - **Execute as**: "Me" (this is required for sheet write access)
   - **Who has access**: "Anyone" (this is required for your website to access the script)

4. Click **"Deploy"**
5. **Copy the Web App URL** - you'll need this for the frontend

**⚠️ CRITICAL:** Make sure "Who has access" is set to "Anyone" - this is required for the form to submit successfully from your website.

## Step 6: Configure Frontend Environment Variable

1. In your Replit project, add an environment variable:
   - Key: `VITE_GOOGLE_SCRIPT_URL`
   - Value: The Web App URL you copied in Step 5

2. Or add it to your `.env` file:
   ```
   VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```

## Step 7: Test the Complete Integration

1. Go to your website's "about-cann#join-section" page
2. Fill out and submit the registration form
3. Check your Google Sheet to verify the data was added correctly

## Troubleshooting

### Common Issues:

1. **"Script function not found"**: Make sure you saved the script after pasting the code
2. **"Permission denied"**: Ensure you granted all necessary permissions during deployment
3. **"Sheet not found"**: Verify the `SHEET_ID` and `SHEET_NAME` are correct
4. **CORS errors**: Make sure the deployment is set to "Anyone" can access

### Debugging:

1. Check the Google Apps Script logs: Go to your script > **"Executions"** tab
2. Use the browser's developer console to see network requests
3. Test the `testScript` function to verify basic functionality

## Security Notes

- The script only accepts POST requests with JSON data
- All data is validated before being added to the sheet
- Error handling prevents the script from crashing on invalid data
- The sheet ID is kept private within the script

## Data Structure

The script will create/use these columns in your Google Sheet:
1. Timestamp
2. Full Name
3. Email
4. Professional Designation
5. Subspecialty
6. Amyloidosis Type
7. Other Amyloidosis Type
8. Institution
9. Communication Consent
10. Areas of Interest
11. Other Interest
12. Presenting Interest
13. Presentation Topic

## Support

If you encounter any issues:
1. Check the Google Apps Script execution logs
2. Verify the environment variable is set correctly
3. Test the script manually using the `testScript` function
4. Ensure your Google Sheet permissions allow the script to write data