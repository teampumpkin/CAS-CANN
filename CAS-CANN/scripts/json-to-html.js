import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertJsonToHtml() {
  try {
    // Read the JSON file
    const jsonPath = path.join(__dirname, '..', 'data', 'website-content.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Generate HTML content
    const htmlContent = generateHtmlFromJson(jsonData);
    
    // Save HTML file
    const htmlPath = path.join(__dirname, '..', 'canadian-amyloidosis-society-content.html');
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    
    console.log(`✓ HTML generated successfully: ${htmlPath}`);
    console.log('✓ You can now open this HTML file in your browser and use "Print to PDF" to create a PDF');
    return htmlPath;
    
  } catch (error) {
    console.error('Error converting JSON to HTML:', error);
    throw error;
  }
}

function generateHtmlFromJson(jsonData) {
  const { metadata, translations, healthcareCenters } = jsonData;
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Canadian Amyloidosis Society - Content Documentation</title>
    <style>
        @media print {
            .page-break { page-break-before: always; }
            body { print-color-adjust: exact; }
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        
        .header {
            text-align: center;
            border-bottom: 4px solid #00AFE6;
            padding-bottom: 30px;
            margin-bottom: 40px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            border-radius: 10px;
            padding: 30px;
        }
        
        .title {
            color: #00AFE6;
            font-size: 36px;
            font-weight: bold;
            margin: 0;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .subtitle {
            color: #666;
            font-size: 18px;
            margin: 15px 0;
            font-weight: 300;
        }
        
        .metadata {
            background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 40px;
            border-left: 6px solid #00DD89;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .section-title {
            color: #00AFE6;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 20px;
            border-bottom: 3px solid #00DD89;
            padding-bottom: 10px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .subsection-title {
            color: #00DD89;
            font-size: 20px;
            font-weight: bold;
            margin: 25px 0 15px 0;
            padding: 10px 0;
            border-bottom: 1px solid #00DD89;
        }
        
        .content-item {
            margin-bottom: 15px;
            padding: 10px 15px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 3px solid #00AFE6;
        }
        
        .key {
            font-weight: bold;
            color: #2c3e50;
            display: inline-block;
            min-width: 250px;
            font-size: 14px;
        }
        
        .value {
            color: #34495e;
            margin-left: 10px;
            font-size: 14px;
        }
        
        .description {
            background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid #00AFE6;
            font-style: italic;
            line-height: 1.7;
            color: #2c3e50;
        }
        
        .long-description {
            background: linear-gradient(135deg, #f0f8ff 0%, #e8f5e8 100%);
            padding: 20px;
            border-radius: 10px;
            margin: 15px 0;
            border-left: 5px solid #00DD89;
            font-size: 15px;
            line-height: 1.8;
            color: #2c3e50;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .toc {
            background: linear-gradient(135deg, #f8f9fa 0%, #fff3e0 100%);
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 40px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .toc-title {
            color: #00AFE6;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .toc-item {
            margin: 8px 0;
            padding: 8px 15px;
            background: rgba(255,255,255,0.7);
            border-radius: 6px;
            font-weight: 500;
        }
        
        .healthcare-center {
            background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
            transition: transform 0.2s ease;
        }
        
        .healthcare-center:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }
        
        .center-name {
            color: #00AFE6;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 12px;
            border-bottom: 2px solid #00DD89;
            padding-bottom: 5px;
        }
        
        .center-details {
            font-size: 14px;
            color: #495057;
            line-height: 1.6;
        }
        
        .center-details strong {
            color: #2c3e50;
            font-weight: 600;
        }
        
        .stats {
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%);
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
            border: 2px solid #00DD89;
            text-align: center;
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            color: #00AFE6;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #fff3e0 0%, #f0f8ff 100%);
            border: 2px dashed #00AFE6;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">Canadian Amyloidosis Society</h1>
        <p class="subtitle">Complete Website Content Documentation</p>
        <p class="subtitle">Generated on ${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <div class="stats">
            <div class="stat-number">76KB</div>
            <div>Total Content Size</div>
        </div>
    </div>
    
    <div class="metadata">
        <h2 class="section-title">📋 Document Metadata</h2>
        <div class="content-item"><span class="key">Version:</span><span class="value">${metadata.version}</span></div>
        <div class="content-item"><span class="key">Last Updated:</span><span class="value">${metadata.lastUpdated}</span></div>
        <div class="content-item"><span class="key">Description:</span><span class="value">${metadata.description}</span></div>
        <div class="content-item"><span class="key">Languages:</span><span class="value">${metadata.languages.join(', ')}</span></div>
        <div class="content-item"><span class="key">Translation Keys:</span><span class="value">${metadata.totalTranslationKeys}</span></div>
        <div class="content-item"><span class="key">Healthcare Centers:</span><span class="value">${metadata.totalHealthcareCenters}</span></div>
        ${metadata.contentCompleteness ? `<div class="content-item"><span class="key">Content Completeness:</span><span class="value">${metadata.contentCompleteness}</span></div>` : ''}
        ${metadata.detailedContentSections ? `<div class="content-item"><span class="key">Detailed Sections:</span><span class="value">${metadata.detailedContentSections.join(', ')}</span></div>` : ''}
    </div>
    
    <div class="toc">
        <h2 class="toc-title">📖 Table of Contents</h2>
        <div class="toc-item">1. 🇬🇧 English Translations</div>
        <div class="toc-item">2. 🇫🇷 French Translations</div>
        <div class="toc-item">3. 🏥 Healthcare Centers Directory</div>
        <div class="toc-item">4. 📝 Detailed Content Sections</div>
    </div>
    
    <div class="highlight-box">
        <h3>🎯 Content Overview</h3>
        <p>This document contains comprehensive website content for the Canadian Amyloidosis Society, including detailed paragraphs, translations, healthcare center information, and all substantial text content from the website components.</p>
    </div>
`;

  // Add English translations
  if (translations && translations.en) {
    html += `
    <div class="page-break"></div>
    <div class="section">
        <h2 class="section-title">🇬🇧 English Translations</h2>
        ${generateTranslationContent(translations.en)}
    </div>`;
  }

  // Add French translations
  if (translations && translations.fr) {
    html += `
    <div class="page-break"></div>
    <div class="section">
        <h2 class="section-title">🇫🇷 French Translations</h2>
        ${generateTranslationContent(translations.fr)}
    </div>`;
  }

  // Add healthcare centers
  if (healthcareCenters && healthcareCenters.length > 0) {
    html += `
    <div class="page-break"></div>
    <div class="section">
        <h2 class="section-title">🏥 Healthcare Centers Directory</h2>
        <div class="highlight-box">
            <strong>Total Centers: ${healthcareCenters.length}</strong>
        </div>
        ${generateHealthcareCentersContent(healthcareCenters)}
    </div>`;
  }

  html += `
    <div class="page-break"></div>
    <div class="section">
        <h2 class="section-title">📄 Document Summary</h2>
        <div class="highlight-box">
            <h3>🏁 Conversion Complete</h3>
            <p><strong>This HTML document contains all the content from your JSON file.</strong></p>
            <p>To create a PDF: Open this HTML file in your browser and use <strong>File → Print → Save as PDF</strong></p>
            <p>For best results, use Chrome or Safari for PDF generation.</p>
        </div>
    </div>
</body>
</html>`;

  return html;
}

function generateTranslationContent(translations, prefix = '') {
  let content = '';
  
  for (const [key, value] of Object.entries(translations)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      content += `<h3 class="subsection-title">📂 ${capitalizeFirst(key.replace(/([A-Z])/g, ' $1'))}</h3>`;
      content += generateTranslationContent(value, fullKey);
    } else if (Array.isArray(value)) {
      content += `<div class="content-item">`;
      content += `<span class="key">${fullKey}:</span>`;
      content += `<span class="value">[${value.join(', ')}]</span>`;
      content += `</div>`;
    } else {
      content += `<div class="content-item">`;
      content += `<span class="key">${fullKey}:</span>`;
      if (typeof value === 'string' && value.length > 150) {
        content += `<div class="long-description">${escapeHtml(value)}</div>`;
      } else if (typeof value === 'string' && value.length > 50) {
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
        <div class="center-name">🏥 ${escapeHtml(center.name || `Healthcare Center ${index + 1}`)}</div>
        <div class="center-details">
            ${center.city ? `<strong>📍 City:</strong> ${escapeHtml(center.city)}<br>` : ''}
            ${center.province ? `<strong>🌎 Province:</strong> ${escapeHtml(center.province)}<br>` : ''}
            ${center.type ? `<strong>🏥 Type:</strong> ${escapeHtml(center.type)}<br>` : ''}
            ${center.specialties ? `<strong>⚕️ Specialties:</strong> ${center.specialties.map(s => escapeHtml(s)).join(', ')}<br>` : ''}
            ${center.phone ? `<strong>📞 Phone:</strong> ${escapeHtml(center.phone)}<br>` : ''}
            ${center.email ? `<strong>📧 Email:</strong> ${escapeHtml(center.email)}<br>` : ''}
            ${center.website ? `<strong>🌐 Website:</strong> ${escapeHtml(center.website)}<br>` : ''}
            ${center.address ? `<strong>📍 Address:</strong> ${escapeHtml(center.address)}<br>` : ''}
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
convertJsonToHtml();