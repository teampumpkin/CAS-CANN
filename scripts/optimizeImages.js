#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Image optimization script
const optimizeImages = async () => {
  const assetsDir = path.join(__dirname, '../attached_assets');
  
  // Check if ImageMagick is available
  exec('which convert', (error) => {
    if (error) {
      console.error('ImageMagick not found. Please install it first.');
      process.exit(1);
    }
  });

  // Get all image files
  const files = fs.readdirSync(assetsDir).filter(file => 
    /\.(jpg|jpeg|png|gif|bmp|tiff)$/i.test(file) && 
    !file.includes('compressed') &&
    !file.includes('optimized')
  );

  console.log(`Found ${files.length} images to optimize...`);

  for (const file of files) {
    const filePath = path.join(assetsDir, file);
    const stats = fs.statSync(filePath);
    const sizeInMB = stats.size / (1024 * 1024);
    
    // Only optimize files larger than 500KB
    if (sizeInMB > 0.5) {
      const outputFile = file.replace(/\.(jpg|jpeg|png|gif|bmp|tiff)$/i, '_optimized.jpg');
      const outputPath = path.join(assetsDir, outputFile);
      
      console.log(`Optimizing ${file} (${sizeInMB.toFixed(2)}MB)...`);
      
      const command = `convert "${filePath}" -quality 75 -resize 1920x1080> -strip "${outputPath}"`;
      
      try {
        await new Promise((resolve, reject) => {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`Error optimizing ${file}:`, error);
              reject(error);
            } else {
              const newStats = fs.statSync(outputPath);
              const newSizeInMB = newStats.size / (1024 * 1024);
              const reduction = ((sizeInMB - newSizeInMB) / sizeInMB * 100).toFixed(1);
              console.log(`✓ ${file} optimized: ${sizeInMB.toFixed(2)}MB → ${newSizeInMB.toFixed(2)}MB (${reduction}% reduction)`);
              resolve();
            }
          });
        });
      } catch (error) {
        console.error(`Failed to optimize ${file}:`, error);
      }
    }
  }
  
  console.log('\nImage optimization complete!');
};

if (require.main === module) {
  optimizeImages();
}

module.exports = { optimizeImages };