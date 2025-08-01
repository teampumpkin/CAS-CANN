import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertJsonToPdf() {
  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, '..', 'data', 'website-content.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Generate HTML content
    const htmlContent = generateHtmlFromJson(jsonData);
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Generate PDF
    const pdfPath = path.join(__dirname, '..', 'canadian-amyloidosis-society-content.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    console.log(`PDF generated successfully: ${pdfPath}`);
    return pdfPath;
    
  } catch (error) {
    console.error('Error converting JSON to PDF:', error);
    throw error;
  }
}

function generateHtmlFromJson(jsonData) {
  const { metadata, translations, healthcareCenters } = jsonData;
  
  let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canadian Amyloidosis Society - Content Documentation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 210mm;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #00AFE6;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        
        .title {
            color: #00AFE6;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
        }
        
        .subtitle {
            color: #666;
            font-size: 16px;
            margin: 10px 0;
        }
        
        .metadata {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 30px;
            border-left: 4px solid #00DD89;
        }
        
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        
        .section-title {
            color: #00AFE6;
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 2px solid #00DD89;
            padding-bottom: 5px;
        }
        
        .subsection-title {
            color: #00DD89;
            font-size: 16px;
            font-weight: bold;
            margin: 15px 0 10px 0;
        }
        
        .content-item {
            margin-bottom: 12px;
            padding-left: 15px;
        }
        
        .key {
            font-weight: bold;
            color: #333;
            display: inline-block;
            min-width: 200px;
        }
        
        .value {
            color: #555;
            margin-left: 10px;
        }
        
        .description {
            background: #f0f8ff;
            padding: 10px;
            border-radius: 5px;
            margin: 8px 0;
            border-left: 3px solid #00AFE6;
            font-style: italic;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .toc {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        
        .toc-title {
            color: #00AFE6;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .toc-item {
            margin: 5px 0;
            padding-left: 10px;
        }
        
        .healthcare-center {
            background: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .center-name {
            color: #00AFE6;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 8px;
        }
        
        .center-details {
            font-size: 14px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">Canadian Amyloidosis Society</h1>
        <p class="subtitle">Complete Website Content Documentation</p>
        <p class="subtitle">Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="metadata">
        <h2 class="section-title">Document Metadata</h2>
        <div class="content-item"><span class="key">Version:</span><span class="value">${metadata.version}</span></div>
        <div class="content-item"><span class="key">Last Updated:</span><span class="value">${metadata.lastUpdated}</span></div>
        <div class="content-item"><span class="key">Description:</span><span class="value">${metadata.description}</span></div>
        <div class="content-item"><span class="key">Languages:</span><span class="value">${metadata.languages.join(', ')}</span></div>
        <div class="content-item"><span class="key">Translation Keys:</span><span class="value">${metadata.totalTranslationKeys}</span></div>
        <div class="content-item"><span class="key">Healthcare Centers:</span><span class="value">${metadata.totalHealthcareCenters}</span></div>
        ${metadata.contentCompleteness ? `<div class="content-item"><span class="key">Completeness:</span><span class="value">${metadata.contentCompleteness}</span></div>` : ''}
    </div>
    
    <div class="toc">
        <h2 class="toc-title">Table of Contents</h2>
        <div class="toc-item">1. English Translations</div>
        <div class="toc-item">2. French Translations</div>
        <div class="toc-item">3. Healthcare Centers Directory</div>
        <div class="toc-item">4. Detailed Content Sections</div>
    </div>
`;

  // Add English translations
  if (translations && translations.en) {
    html += `
    <div class="page-break"></div>
    <div class="section">
        <h2 class="section-title">English Translations</h2>
        ${generateTranslationContent(translations.en)}
    </div>`;
  }

  // Add French translations
  if (translations && translations.fr) {
    html += `
    <div class="page-break"></div>
    <div class="section">
        <h2 class="section-title">French Translations</h2>
        ${generateTranslationContent(translations.fr)}
    </div>`;
  }

  // Add healthcare centers
  if (healthcareCenters && healthcareCenters.length > 0) {
    html += `
    <div class="page-break"></div>
    <div class="section">
        <h2 class="section-title">Healthcare Centers Directory</h2>
        ${generateHealthcareCentersContent(healthcareCenters)}
    </div>`;
  }

  html += `
</body>
</html>`;

  return html;
}

function generateTranslationContent(translations, prefix = '') {
  let content = '';
  
  for (const [key, value] of Object.entries(translations)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      content += `<h3 class="subsection-title">${capitalizeFirst(key)}</h3>`;
      content += generateTranslationContent(value, fullKey);
    } else if (Array.isArray(value)) {
      content += `<div class="content-item">`;
      content += `<span class="key">${fullKey}:</span>`;
      content += `<span class="value">[${value.join(', ')}]</span>`;
      content += `</div>`;
    } else {
      content += `<div class="content-item">`;
      content += `<span class="key">${fullKey}:</span>`;
      if (typeof value === 'string' && value.length > 100) {
        content += `<div class="description">${escapeHtml(value)}</div>`;
      } else {
        content += `<span class="value">${escapeHtml(String(value))}</span>`;
      }
      content += `</div>`;
    }
  }
  
  return content;
}

function generateHealthcareCentersContent(healthcareCenters) {
  let content = '';
  
  healthcareCenters.forEach((center, index) => {
    content += `
    <div class="healthcare-center">
        <div class="center-name">${escapeHtml(center.name || `Center ${index + 1}`)}</div>
        <div class="center-details">
            ${center.city ? `<strong>City:</strong> ${escapeHtml(center.city)}<br>` : ''}
            ${center.province ? `<strong>Province:</strong> ${escapeHtml(center.province)}<br>` : ''}
            ${center.type ? `<strong>Type:</strong> ${escapeHtml(center.type)}<br>` : ''}
            ${center.specialties ? `<strong>Specialties:</strong> ${center.specialties.map(s => escapeHtml(s)).join(', ')}<br>` : ''}
            ${center.phone ? `<strong>Phone:</strong> ${escapeHtml(center.phone)}<br>` : ''}
            ${center.email ? `<strong>Email:</strong> ${escapeHtml(center.email)}<br>` : ''}
            ${center.website ? `<strong>Website:</strong> ${escapeHtml(center.website)}<br>` : ''}
        </div>
    </div>`;
  });
  
  return content;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Run the conversion
convertJsonToPdf()
  .then(pdfPath => {
    console.log('✓ PDF conversion completed successfully');
    console.log(`✓ File saved to: ${pdfPath}`);
  })
  .catch(error => {
    console.error('✗ PDF conversion failed:', error);
    process.exit(1);
  });