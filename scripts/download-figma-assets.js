const https = require('https');
const fs = require('fs');
const path = require('path');

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, '../public/assets/images');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// List of all Figma asset URLs used in the project
const assets = [
  // HeroSection images
  { url: 'https://www.figma.com/api/mcp/asset/96af6ca7-4f26-4a75-800c-6a35d2c53ba1', name: 'ellipse-purple.svg' },
  { url: 'https://www.figma.com/api/mcp/asset/7195474b-aec4-4615-973c-3450416eee3b', name: 'ellipse-blue.svg' },
  { url: 'https://www.figma.com/api/mcp/asset/ed192455-70eb-497a-9e86-82f761b58b3d', name: 'gradient-underline.svg' },
  { url: 'https://www.figma.com/api/mcp/asset/89ff2842-9b21-484f-8c00-d101e1e17fe1', name: 'worker.png' },
  { url: 'https://www.figma.com/api/mcp/asset/077b4f1a-7f5c-400a-96d9-1e65cacc7073', name: 'search-icon.svg' },
  { url: 'https://www.figma.com/api/mcp/asset/34695208-afc1-4ea2-b839-adcf40d7eea8', name: 'email-icon.svg' },

  // Header images
  { url: 'https://www.figma.com/api/mcp/asset/5a2ef3ee-6c12-4098-81cb-12e34ebcc80d', name: 'logo.svg' },
  { url: 'https://www.figma.com/api/mcp/asset/f700c408-7281-4da5-ae5b-1b007a13086c', name: 'plus-icon.svg' },
];

// Download function
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(assetsDir, filename);

    console.log(`Downloading ${filename}...`);

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Downloaded ${filename}`);
          resolve();
        });

        fileStream.on('error', (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });
      } else {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Download all assets
async function downloadAll() {
  console.log('Starting download of Figma assets...\n');

  for (const asset of assets) {
    try {
      await downloadImage(asset.url, asset.name);
    } catch (error) {
      console.error(`✗ Error downloading ${asset.name}:`, error.message);
    }
  }

  console.log('\nAll downloads complete!');
  console.log(`Assets saved to: ${assetsDir}`);
}

downloadAll();
