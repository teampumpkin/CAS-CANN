import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function convertOrganizedJsonToHtml() {
  try {
    // Read the organized JSON file
    const jsonPath = path.join(__dirname, '..', 'canadian-amyloidosis-society-content-organized.json');
    const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    // Generate HTML content
    const htmlContent = generateHtmlFromOrganizedJson(jsonData);
    
    // Save HTML file
    const htmlPath = path.join(__dirname, '..', 'canadian-amyloidosis-society-organized-content.html');
    fs.writeFileSync(htmlPath, htmlContent, 'utf8');
    
    console.log(`✓ Organized HTML generated successfully: ${htmlPath}`);
    console.log('✓ Content is now organized with clear headings and subheadings');
    return htmlPath;
    
  } catch (error) {
    console.error('Error converting organized JSON to HTML:', error);
    throw error;
  }
}

function generateHtmlFromOrganizedJson(jsonData) {
  const { document_info } = jsonData;
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document_info.title}</title>
    <style>
        @media print {
            .page-break { page-break-before: always; }
            body { print-color-adjust: exact; }
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.7;
            color: #2c3e50;
            max-width: 1200px;
            margin: 0 auto;
            padding: 30px;
            background: #fff;
        }
        
        .header {
            text-align: center;
            border-bottom: 4px solid #00AFE6;
            padding: 40px;
            margin-bottom: 50px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 100%);
            border-radius: 15px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        
        .title {
            color: #00AFE6;
            font-size: 42px;
            font-weight: bold;
            margin: 0 0 20px 0;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        
        .subtitle {
            color: #666;
            font-size: 20px;
            margin: 15px 0;
            font-weight: 300;
        }
        
        .doc-info {
            background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%);
            padding: 30px;
            border-radius: 15px;
            margin-bottom: 50px;
            border: 2px solid #00DD89;
            box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .info-item {
            background: rgba(255,255,255,0.8);
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid #00AFE6;
        }
        
        .info-label {
            font-weight: bold;
            color: #00AFE6;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .info-value {
            color: #2c3e50;
            font-weight: 600;
            margin-top: 5px;
        }
        
        .main-section {
            margin-bottom: 60px;
            page-break-inside: avoid;
        }
        
        .section-number {
            display: inline-block;
            background: #00AFE6;
            color: white;
            padding: 8px 15px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 15px;
        }
        
        .section-title {
            color: #00AFE6;
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 30px;
            border-bottom: 3px solid #00DD89;
            padding-bottom: 15px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }
        
        .subsection {
            margin-bottom: 40px;
            padding-left: 20px;
            border-left: 3px solid #00DD89;
            background: linear-gradient(90deg, rgba(0,221,137,0.05) 0%, transparent 100%);
            padding: 25px;
            border-radius: 0 10px 10px 0;
        }
        
        .subsection-title {
            color: #00DD89;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        
        .subsection-number {
            background: #00DD89;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            margin-right: 15px;
            font-weight: bold;
        }
        
        .heading {
            color: #2c3e50;
            font-size: 20px;
            font-weight: bold;
            margin: 25px 0 15px 0;
            padding: 10px 0;
            border-bottom: 2px solid #e9ecef;
        }
        
        .subheading {
            color: #00AFE6;
            font-size: 16px;
            font-weight: 600;
            margin: 15px 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .description {
            color: #34495e;
            font-size: 16px;
            line-height: 1.8;
            margin: 15px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #00AFE6;
        }
        
        .detailed-content {
            background: linear-gradient(135deg, #f0f8ff 0%, #e8f5e8 100%);
            padding: 25px;
            border-radius: 12px;
            margin: 20px 0;
            border-left: 5px solid #00DD89;
            font-size: 16px;
            line-height: 1.8;
            color: #2c3e50;
            box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        }
        
        .content-box {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        
        .content-box-title {
            color: #00AFE6;
            font-weight: bold;
            font-size: 18px;
            margin-bottom: 10px;
            border-bottom: 1px solid #00DD89;
            padding-bottom: 5px;
        }
        
        .content-list {
            list-style: none;
            padding: 0;
        }
        
        .content-list li {
            padding: 8px 0;
            border-bottom: 1px solid #f8f9fa;
            position: relative;
            padding-left: 25px;
        }
        
        .content-list li:before {
            content: "→";
            color: #00DD89;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 25px 0;
        }
        
        .stat-card {
            background: linear-gradient(135deg, #00AFE6 0%, #00DD89 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 15px rgba(0,175,230,0.3);
        }
        
        .stat-number {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 14px;
            opacity: 0.9;
        }
        
        .page-break {
            page-break-before: always;
        }
        
        .toc {
            background: linear-gradient(135deg, #f8f9fa 0%, #fff3e0 100%);
            padding: 40px;
            border-radius: 15px;
            margin-bottom: 50px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        
        .toc-title {
            color: #00AFE6;
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 25px;
            text-align: center;
            border-bottom: 2px solid #00DD89;
            padding-bottom: 15px;
        }
        
        .toc-item {
            margin: 12px 0;
            padding: 12px 20px;
            background: rgba(255,255,255,0.8);
            border-radius: 8px;
            font-weight: 500;
            border-left: 4px solid #00AFE6;
            transition: all 0.3s ease;
        }
        
        .toc-item:hover {
            transform: translateX(5px);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .highlight-banner {
            background: linear-gradient(135deg, #fff3e0 0%, #f0f8ff 100%);
            border: 2px dashed #00AFE6;
            border-radius: 15px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
        }
        
        .banner-title {
            color: #00AFE6;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 15px;
        }
        
        .banner-text {
            color: #2c3e50;
            font-size: 16px;
            line-height: 1.6;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">${document_info.title}</h1>
        <p class="subtitle">Organized Content Documentation</p>
        <p class="subtitle">Version ${document_info.version} • ${document_info.date}</p>
    </div>
    
    <div class="doc-info">
        <h2 class="section-title">📋 Document Information</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">Total Size</div>
                <div class="info-value">${document_info.total_size}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Languages</div>
                <div class="info-value">${document_info.languages.join(' & ')}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Content Sections</div>
                <div class="info-value">${document_info.content_sections}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Description</div>
                <div class="info-value">${document_info.description}</div>
            </div>
        </div>
    </div>
    
    <div class="toc">
        <h2 class="toc-title">📖 Table of Contents</h2>
        <div class="toc-item">1. 🏠 Homepage Content</div>
        <div class="toc-item">2. 🏢 About CAS Page</div>
        <div class="toc-item">3. ⚕️ About Amyloidosis Page</div>
        <div class="toc-item">4. 🌐 CANN Network Page</div>
        <div class="toc-item">5. 📚 Resources Page</div>
        <div class="toc-item">6. 📞 Contact Page</div>
        <div class="toc-item">7. 🏥 Healthcare Directory</div>
        <div class="toc-item">8. 🇫🇷 French Translations</div>
    </div>
    
    <div class="highlight-banner">
        <div class="banner-title">🎯 Content Organization</div>
        <div class="banner-text">This document is now organized with clear <strong>headings</strong> and <strong>subheadings</strong> for easy navigation. Each section contains detailed content with proper hierarchy and structure.</div>
    </div>
`;

  // Process each main section
  Object.entries(jsonData).forEach(([key, value]) => {
    if (key === 'document_info') return;
    
    const sectionNumber = key.split('_')[0];
    const sectionName = key.split('_').slice(1).join(' ');
    
    html += `
    <div class="page-break"></div>
    <div class="main-section">
        <div class="section-number">${sectionNumber}</div>
        <h2 class="section-title">${formatSectionName(sectionName)}</h2>
        ${generateSectionContent(value)}
    </div>`;
  });

  html += `
    <div class="page-break"></div>
    <div class="main-section">
        <div class="highlight-banner">
            <div class="banner-title">🏁 Document Complete</div>
            <div class="banner-text">
                <strong>All content has been organized with clear headings and subheadings.</strong><br>
                To create a PDF: Open this HTML file in your browser and use <strong>File → Print → Save as PDF</strong>
            </div>
        </div>
    </div>
</body>
</html>`;

  return html;
}

function generateSectionContent(section) {
  let content = '';
  
  Object.entries(section).forEach(([key, value]) => {
    const subsectionNumber = key.split('_')[0];
    const subsectionName = key.split('_').slice(1).join(' ');
    
    content += `
    <div class="subsection">
        <h3 class="subsection-title">
            <span class="subsection-number">${subsectionNumber}</span>
            ${formatSectionName(subsectionName)}
        </h3>
        ${generateSubsectionContent(value)}
    </div>`;
  });
  
  return content;
}

function generateSubsectionContent(content) {
  let html = '';
  
  Object.entries(content).forEach(([key, value]) => {
    if (typeof value === 'string') {
      if (key === 'heading') {
        html += `<div class="heading">${escapeHtml(value)}</div>`;
      } else if (key === 'subheading') {
        html += `<div class="subheading">${escapeHtml(value)}</div>`;
      } else if (key === 'description') {
        html += `<div class="description">${escapeHtml(value)}</div>`;
      } else if (key === 'detailed_content') {
        html += `<div class="detailed-content">${escapeHtml(value)}</div>`;
      } else {
        html += `<div class="content-box">
          <div class="content-box-title">${formatKey(key)}</div>
          <div>${escapeHtml(value)}</div>
        </div>`;
      }
    } else if (Array.isArray(value)) {
      html += `<div class="content-box">
        <div class="content-box-title">${formatKey(key)}</div>
        <ul class="content-list">
          ${value.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>`;
    } else if (typeof value === 'object' && value !== null) {
      html += `<div class="content-box">
        <div class="content-box-title">${formatKey(key)}</div>
        ${generateNestedContent(value)}
      </div>`;
    }
  });
  
  return html;
}

function generateNestedContent(obj) {
  let content = '';
  
  Object.entries(obj).forEach(([key, value]) => {
    if (typeof value === 'string') {
      content += `<div style="margin: 10px 0;">
        <strong>${formatKey(key)}:</strong> ${escapeHtml(value)}
      </div>`;
    } else if (Array.isArray(value)) {
      content += `<div style="margin: 10px 0;">
        <strong>${formatKey(key)}:</strong>
        <ul class="content-list">
          ${value.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>`;
    }
  });
  
  return content;
}

function formatSectionName(name) {
  return name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function formatKey(key) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
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
convertOrganizedJsonToHtml();